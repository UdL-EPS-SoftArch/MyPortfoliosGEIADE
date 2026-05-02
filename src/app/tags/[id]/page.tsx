import Link from "next/link";
import { revalidatePath } from "next/cache";
import { TagsService } from "@/api/tagApi";
import { serverAuthProvider } from "@/lib/authProvider";
import { notFound, redirect } from "next/navigation";
import AssignContentToggle from "../AssignContentToggle";
import DeleteTagButton from "../DeleteTagButton";
import DeleteTagFromContentButton from "../DeleteTagFromContentButton";

async function assignContentAction(formData: FormData) {
  "use server";

  const tagId = Number(formData.get("tagId"));
  const contentId = Number(formData.get("contentId"));

  if (!tagId || !contentId) {
    return;
  }

  const service = new TagsService(serverAuthProvider);
  await service.assignContentToTag(tagId, contentId);
  revalidatePath(`/tags/${tagId}`);
}

async function deleteTagFromContentAction(formData: FormData) {
  "use server";

  const tagId = Number(formData.get("tagId"));
  const contentId = Number(formData.get("contentId"));

  if (!tagId || !contentId) {
    return;
  }

  const service = new TagsService(serverAuthProvider);
  await service.removeContentFromTag(tagId, contentId);
  revalidatePath("/tags");
  revalidatePath(`/tags/${tagId}`);
}

async function deleteTagAction(formData: FormData) {
  "use server";

  const tagId = Number(formData.get("tagId"));

  if (!tagId) {
    return;
  }

  const service = new TagsService(serverAuthProvider);
  await service.deleteTag(tagId);
  revalidatePath("/tags");
  redirect("/tags");
}

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
  const availableContents = await service.findAvailableContentsByTagId(id);

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

            <div className="mt-4 flex items-center gap-3">
              <AssignContentToggle />
              {tag.id && (
                <DeleteTagButton
                  action={deleteTagAction}
                  tagId={tag.id}
                />
              )}
            </div>
          </div>

          <div id="assign-content-panel" className="hidden border-b border-[#efe8eb] bg-[#fcfbfb] px-8 py-6">
            <div className="mx-auto max-w-3xl">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-[#111111]">Asignar content a esta tag</h2>
                <p className="mt-1 text-sm text-[#6a6467]">Introduce el ID del content que quieras vincular a esta tag.</p>
              </div>

              <form action={assignContentAction} className="grid gap-4">
                <input type="hidden" name="tagId" value={String(tag.id ?? "")} />
                <div className="grid gap-4 md:grid-cols-[1fr]">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contentId" className="text-sm font-medium text-[#2a2728]">Selecciona contenido</label>
                    <select id="contentId" name="contentId" required className="w-full rounded-2xl border border-[#ddd4d8] bg-white px-4 py-3 text-[#111111] outline-none transition focus:border-[#8f1d56] focus:ring-4 focus:ring-[#8f1d56]/10">
                      <option value="">-- Selecciona --</option>
                      {availableContents.length > 0 ? (
                        availableContents.map((c) => (
                          <option key={c.contentId ?? c.name} value={String(c.contentId ?? "")}>
                            {c.contentId ? `${c.contentId} - ${c.name}` : c.name}
                          </option>
                        ))
                      ) : (
                        <option value="">No hay contenidos disponibles</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" className="inline-flex items-center rounded-2xl bg-[#8f1d56] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#77184a]">Asignar</button>
                </div>
              </form>
            </div>
          </div>

          {/* Contenidos */}
          <div className="px-8 py-8">
            <h2 className="mb-6 text-lg font-semibold text-[#111111]">
              Contents vinculados
            </h2>

            {contents.length > 0 ? (
              <ul className="grid gap-4">
                {contents.map((content) => (
                  <li
                    key={content.contentId ?? content.name}
                    className="rounded-2xl border border-[#ece5e8] bg-white p-5 transition hover:border-[#d7b8c7] hover:shadow-[0_10px_25px_rgba(143,29,86,0.08)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-lg font-semibold">
                          {content.name}
                        </div>

                        {content.description && (
                          <div className="mt-1 text-sm text-[#615b5e]">
                            {content.description}
                          </div>
                        )}
                      </div>

                      {content.contentId && tag.id && (
                        <DeleteTagFromContentButton
                          action={deleteTagFromContentAction}
                          contentId={content.contentId}
                          tagId={tag.id}
                        />
                      )}
                    </div>

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
