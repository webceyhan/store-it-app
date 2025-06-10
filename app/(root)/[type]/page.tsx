import Sort from "@/components/Sort";

export default async function Page({ params }: { params: { type: string } }) {
  const { type } = await params;

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

      {/* render the files here */}
    </div>
  );
}
