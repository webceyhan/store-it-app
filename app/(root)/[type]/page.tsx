import { getFiles } from "@/lib/actions/file.actions";
import { convertFileSize, getFileTypesParams } from "@/lib/utils";
import Sort from "@/components/Sort";
import Card from "@/components/Card";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ search?: string; sort?: string }>;
}) {
  //
  const { type } = await params;
  const { search, sort } = await searchParams;

  const types = getFileTypesParams(type);
  const files = await getFiles({ types, search, sort });

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">{convertFileSize(totalSize)}</span>
          </p>

          <div className="sort-container">
            <p className="body-1 max-sm:hidden text-light-200">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>

      {files.length > 0 ? (
        <section className="file-list">
          {files.map((file) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className="body-1">No files found.</p>
      )}
    </div>
  );
}
