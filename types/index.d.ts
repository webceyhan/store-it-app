import { Models } from "node-appwrite";

export type User = Models.Document & {
  fullName: string;
  email: string;
  avatar: string;
  accountId: string;
};

export type File = Models.Document & {
  name: string;
  type: string;
  url: string;
  ownerId: string;
  accountId: string;
  size?: number;
  extension?: string;
};
