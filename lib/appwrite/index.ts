"use server";

import { cookies } from "next/headers";
import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { API_KEY, ENDPOINT, PROJECT_ID } from "./config";

export * as appwriteConfig from "./config";

export const createSessionClient = async () => {
  const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value) {
    throw new Error("No session found");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};
