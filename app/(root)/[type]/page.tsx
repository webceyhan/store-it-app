import { getFiles } from "@/lib/actions/file.actions";
import Sort from "@/components/Sort";
import Card from "@/components/Card";

export default async function Page({ params }: { params: { type: string } }) {
  //
  const { type } = await params;

  const files = await getFiles();

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">0 MB</span>
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
