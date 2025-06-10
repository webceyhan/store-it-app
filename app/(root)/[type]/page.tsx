export default async function Page({ params }: { params: { type: string } }) {
  const { type } = await params;

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
      </section>
    </div>
  );
}
