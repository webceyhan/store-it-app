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
      owner: ownerId,
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

export const getFiles = async ({
  types,
  search,
  sort = "$createdAt-desc",
  limit = 100,
}: {
  types: string[];
  search?: string;
  sort?: string;
  limit?: number;
}) => {
  try {
    const { databases } = await createAdminClient();
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const [sortBy, sortDirection] = sort.split("-");

    const queries = [
      Query.or([
        Query.equal("owner", currentUser.$id),
        Query.contains("users", currentUser.email),
      ]),
      Query.limit(limit),
      sortDirection === "asc"
        ? Query.orderAsc(sortBy)
        : Query.orderDesc(sortBy),
    ];

    if (types.length > 0) {
      queries.push(Query.equal("type", types));
    }

    if (search) {
      queries.push(Query.contains("name", search));
    }

    const files = await databases.listDocuments(
      config.DATABASE_ID,
      config.FILES_COLLECTION_ID,
      queries
    );

    return parseStringify(files.documents);
  } catch (error) {
    handleError(error, "Failed to fetch files");
  }

  return [];
};

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: {
  fileId: string;
  name: string;
  extension: string;
  path: string;
}) => {
  const { databases } = await createAdminClient();

  try {
    const updatedFile = await databases.updateDocument(
      config.DATABASE_ID,
      config.FILES_COLLECTION_ID,
      fileId,
      {
        name: `${name}.${extension}`,
      }
    );

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to rename file");
  }
};

export const updateFileUsers = async ({
  fileId,
  users,
  path,
}: {
  fileId: string;
  users: string[];
  path: string;
}) => {
  const { databases } = await createAdminClient();

  try {
    const updatedFile = await databases.updateDocument(
      config.DATABASE_ID,
      config.FILES_COLLECTION_ID,
      fileId,
      {
        users,
      }
    );

    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError(error, "Failed to update file users");
  }
};

export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: {
  fileId: string;
  bucketFileId: string;
  path: string;
}) => {
  const { databases, storage } = await createAdminClient();

  try {
    const deletedFile = await databases.deleteDocument(
      config.DATABASE_ID,
      config.FILES_COLLECTION_ID,
      fileId
    );

    if (!deletedFile) {
      throw new Error("File document not found");
    }

    await storage.deleteFile(config.BUCKET_ID, bucketFileId);

    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    handleError(error, "Failed to delete file");
  }
};
