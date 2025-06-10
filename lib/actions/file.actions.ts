"use server";

import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { revalidatePath } from "next/cache";

import type { File } from "@/types";
import { config, createAdminClient } from "../appwrite";
import { getCurrentUser } from "./user.actions";
import {
  constructFileUrl,
  getFileType,
  handleError,
  parseStringify,
} from "../utils";

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: {
  file: Blob & { name: string };
  ownerId: string;
  accountId: string;
  path: string;
}) => {
  //
  const { storage, databases } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile(
      config.BUCKET_ID,
      ID.unique(),
      inputFile
    );

    // construct the file document
    const fileDocument: File = {
      ...getFileType(bucketFile.name),
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      size: bucketFile.sizeOriginal,
      ownerId,
      accountId,
      bucketFileId: bucketFile.$id,
      users: [],
    };

    const newFile = await databases
      .createDocument(
        config.DATABASE_ID,
        config.FILES_COLLECTION_ID,
        ID.unique(),
        fileDocument
      )
      .catch(async (error) => {
        // If file upload fails, delete the file from storage
        await storage.deleteFile(config.BUCKET_ID, bucketFile.$id);
        handleError(error, "Failed to create file document");
      });

    revalidatePath(path);

    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};

export const getFiles = async () => {
  try {
    const { databases } = await createAdminClient();
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const files = await databases.listDocuments(
      config.DATABASE_ID,
      config.FILES_COLLECTION_ID,
      [
        Query.or([
          Query.equal("ownerId", currentUser.$id),
          Query.contains("users", currentUser.email),
        ]),
      ]
    );

    return parseStringify(files.documents);
  } catch (error) {
    handleError(error, "Failed to fetch files");
  }

  return [];
};
