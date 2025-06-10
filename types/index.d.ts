export type User = {
  fullName: string;
  email: string;
  avatar: string;
  accountId: string;
};

export type File = {
  name: string;
  type: string;
  url: string;
  owner: User | string;
  accountId: string;
  bucketFileId: string;
  size?: number;
  extension?: string;
  users?: string[];
};
