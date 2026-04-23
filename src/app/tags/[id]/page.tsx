import Link from "next/link";
import { TagsService } from "@/api/tagApi";
import { serverAuthProvider } from "@/lib/authProvider";
import { notFound } from "next/navigation";

export default async function TagDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (Number.isNaN(id)) {
    notFound();
  }

  const service = new TagsService(serverAuthProvider);

  const tag = await service.findById(id);
  if (!tag) {
    notFound();
  }

  const contents = await service.findContentsByTagId(id);

  return (
    <div className="min-h-screen bg-[#f6f4f5] text-[#111111]">
      <main className="mx-auto w-full max-w-5xl px-6 py-10">

        {/* 🔙 Back */}
        <div className="mb-6">
          <Link
            href="/tags"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#8f1d56] hover:underline"
          >
            ← Volver
          </Link>
        </div>

        {/* 🧱 Card principal */}
        <section className="overflow-hidden rounded-3xl border border-[#e6dde1] bg-white shadow-[0_10px_30px_rgba(17,17,17,0.04)]">

          {/* Header */}
          <div className="border-b border-[#efe8eb] px-8 py-8">
            <span className="mb-3 inline-flex rounded-full border border-[#ead4de] bg-[#faf5f7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8f1d56]">
              Tag
            </span>

            <h1 className="text-3xl font-bold tracking-tight">
              {tag.name}
            </h1>

            {tag.description && (
              <p className="mt-3 max-w-2xl text-sm text-[#5f5a5c]">
                {tag.description}
              </p>
            )}
          </div>

          {/* Contenidos */}
          <div className="px-8 py-8">
            <h2 className="mb-6 text-lg font-semibold text-[#111111]">
              Contents vinculados
            </h2>

            {contents.length > 0 ? (
              <ul className="grid gap-4">
                {contents.map((content: any) => (
                  <li
                    key={content.contentId ?? content.name}
                    className="rounded-2xl border border-[#ece5e8] bg-white p-5 transition hover:border-[#d7b8c7] hover:shadow-[0_10px_25px_rgba(143,29,86,0.08)]"
                  >
                    <div className="text-lg font-semibold">
                      {content.name}
                    </div>

                    {content.description && (
                      <div className="mt-1 text-sm text-[#615b5e]">
                        {content.description}
                      </div>
                    )}

                    {content.contentId && (
                      <div className="mt-3 text-xs uppercase tracking-[0.14em] text-[#948c90]">
                        ID #{content.contentId}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#d8c9cf] bg-[#fcfbfb] px-6 py-10 text-center">
                <p className="text-sm text-[#8a8387]">
                  No hay contenidos asociados a esta tag.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}