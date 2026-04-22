import type { Resource } from "@soupy/shared";

const categoryLabels: Record<Resource["category"], string> = {
  shelter: "Shelter",
  food: "Food",
  hygiene: "Hygiene",
  transportation: "Transportation",
  healthcare: "Healthcare",
  mental_health: "Mental health",
  employment: "Employment",
  legal_documentation: "ID and documents"
};

export function ResourceCards({ resources }: { resources: Resource[] }) {
  if (resources.length === 0) {
    return (
      <section className="bg-white p-5 shadow-sm" aria-label="Resource next steps">
        <h2 className="text-xl font-bold">Next steps</h2>
        <p className="mt-2 text-lg text-slate-700">
          Tell Soupy what feels most urgent, and it will suggest a category and simple next step.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Suggested resources">
      <h2 className="mb-3 text-2xl font-black">Suggested DC resources</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {resources.map((resource) => (
          <article key={resource.id} className="border-2 border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-calm">{categoryLabels[resource.category]}</p>
            <h3 className="mt-1 text-xl font-black">{resource.name}</h3>
            <dl className="mt-3 space-y-2 text-lg">
              <div>
                <dt className="font-bold">Address</dt>
                <dd>{resource.address}</dd>
              </div>
              <div>
                <dt className="font-bold">Phone</dt>
                <dd>
                  <a className="text-calm underline" href={`tel:${resource.phone}`}>
                    {resource.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-bold">Hours</dt>
                <dd>{resource.hours}</dd>
              </div>
            </dl>
            <p className="mt-3 text-base text-slate-700">{resource.notes}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
