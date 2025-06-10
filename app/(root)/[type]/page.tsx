import { getFiles } from "@/lib/actions/file.actions";
import Sort from "@/components/Sort";

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
            <div key={file.$id} className="file-item">
              <p className="file-name">{file.name}</p>
              <p className="file-size">{file.size} MB</p>
            </div>
          ))}
        </section>
      ) : (
        <p className="body-1">No files found.</p>
      )}
    </div>
  );
}
