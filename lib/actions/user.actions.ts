"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID, Models, Query } from "node-appwrite";

import type { User } from "@/types";
import { AVATAR_PLACEHOLDER_URL } from "@/constants";
import { config, createAdminClient, createSessionClient } from "@/lib/appwrite";
import { handleError, parseStringify } from "../utils";

// create account flow
// 1. user enters full name and email
// 2. check if the user already exists using the email
// 3. sent OTP to the user's email
// 4. this will send a secret key for creating a session, the secret key will be used to create a session
// 5. return the user's accountId that will be used to login
// 6. verify the OTP and authenticate the user

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });

  if (!existingUser) {
    const { databases } = await createAdminClient();

    try {
      await databases.createDocument(
        config.DATABASE_ID,
        config.USERS_COLLECTION_ID,
        ID.unique(),
        {
          fullName,
          email,
          avatar: AVATAR_PLACEHOLDER_URL,
          accountId,
        }
      );

      return parseStringify({ accountId });
    } catch (error) {
      handleError(error, "Failed to create user document");
    }
  }
};

export const verifyOTP = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();

    const result = await account.get();

    const user = await databases.listDocuments<User & Models.Document>(
      config.DATABASE_ID,
      config.USERS_COLLECTION_ID,
      [Query.equal("accountId", result.$id)]
    );

    if (user.total === 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    handleError(error, "Failed to get current user");
  }
  return null;
};

export const signOutUser = async () => {
  try {
    const { account } = await createSessionClient();

    await account.deleteSession("current");

    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  }

  redirect("/sign-in");
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { accountId: null, error: "User not found." };
    }

    await sendEmailOTP({ email });
    return parseStringify({ accountId: existingUser.accountId });
  } catch (error) {
    handleError(error, "Failed to sign in user");
  }
};

// HELPERS /////////////////////////////////////////////////////////////////////////////////////////

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    config.DATABASE_ID,
    config.USERS_COLLECTION_ID,
    [Query.equal("email", email)]
  );

  return result.documents[0] ?? null;
};
