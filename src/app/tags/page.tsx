import Link from "next/link";
import { revalidatePath } from "next/cache";
import { TagsService } from "@/api/tagApi";
import { serverAuthProvider } from "@/lib/authProvider";
import type { Tag } from "@/types/tag";
import CreateTagToggle from "./CreateTagToggle";
import DeleteTagButton from "./DeleteTagButton";

async function createTagAction(formData: FormData) {
    "use server";

    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!name) {
        return;
    }

    const service = new TagsService(serverAuthProvider);

    const tag = {
        name,
        description,
    } as Tag;

    await service.createTag(tag);
    revalidatePath("/tags");
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
}

export default async function TagsPage() {
    const service = new TagsService(serverAuthProvider);
    const tags = await service.getTags();

    return (
        <div className="min-h-screen bg-[#f6f4f5] text-[#111111]">
            <main className="mx-auto w-full max-w-6xl px-6 py-10">
                <section className="overflow-hidden rounded-3xl border border-[#e6dde1] bg-white shadow-[0_10px_30px_rgba(17,17,17,0.04)]">
                    <div className="flex flex-col gap-6 border-b border-[#efe8eb] px-8 py-8 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <span className="mb-3 inline-flex rounded-full border border-[#ead4de] bg-[#faf5f7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8f1d56]">
                                Universitat de Lleida · Tags
                            </span>

                            <h1 className="text-4xl font-bold tracking-tight text-[#111111]">
                                Gestión de tags
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-[#5f5a5c]">
                                Consulta, crea y navega las etiquetas del sistema en una interfaz
                                limpia y minimalista.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl border border-[#ead4de] bg-[#faf5f7] px-4 py-3 text-right">
                                <div className="text-xs font-medium uppercase tracking-[0.14em] text-[#8f1d56]">
                                    Total
                                </div>
                                <div className="text-2xl font-bold text-[#111111]">
                                    {tags.length}
                                </div>
                            </div>

                            <CreateTagToggle />
                        </div>
                    </div>

                    <div
                        id="create-tag-panel"
                        className="hidden border-b border-[#efe8eb] bg-[#fcfbfb] px-8 py-6"
                    >
                        <div className="mx-auto max-w-3xl">
                            <div className="mb-5">
                                <h2 className="text-xl font-semibold text-[#111111]">
                                    Nueva tag
                                </h2>
                                <p className="mt-1 text-sm text-[#6a6467]">
                                    Crea una etiqueta con nombre y una descripción breve.
                                </p>
                            </div>

                            <form action={createTagAction} className="grid gap-4">
                                <div className="grid gap-4 md:grid-cols-[1.1fr_1.4fr]">
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="name"
                                            className="text-sm font-medium text-[#2a2728]"
                                        >
                                            Nombre
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            placeholder="Ej. Inteligencia Artificial"
                                            className="w-full rounded-2xl border border-[#ddd4d8] bg-white px-4 py-3 text-[#111111] outline-none transition focus:border-[#8f1d56] focus:ring-4 focus:ring-[#8f1d56]/10"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="description"
                                            className="text-sm font-medium text-[#2a2728]"
                                        >
                                            Descripción
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={3}
                                            placeholder="Descripción corta y clara de la tag"
                                            className="w-full resize-none rounded-2xl border border-[#ddd4d8] bg-white px-4 py-3 text-[#111111] outline-none transition focus:border-[#8f1d56] focus:ring-4 focus:ring-[#8f1d56]/10"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center rounded-2xl bg-[#8f1d56] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#77184a]"
                                    >
                                        Crear tag
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="px-8 py-8">
                        {tags.length > 0 ? (
                            <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {tags.map((tag, index) => (
                                    <li
                                        key={tag.id ?? `${tag.name}-${index}`}
                                        className="group rounded-3xl border border-[#ece5e8] bg-white p-6 transition duration-200 hover:-translate-y-0.5 hover:border-[#d7b8c7] hover:shadow-[0_14px_32px_rgba(143,29,86,0.08)]"
                                    >
                                        <div className="mb-4 flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                {tag.id ? (
                                                    <Link
                                                        href={`/tags/${tag.id}`}
                                                        className="block text-xl font-semibold leading-tight text-[#111111] transition group-hover:text-[#8f1d56]"
                                                    >
                                                        {tag.name}
                                                    </Link>
                                                ) : (
                                                    <span className="block text-xl font-semibold text-[#8f1d56]">
                                                        {tag.name}
                                                    </span>
                                                )}
                                            </div>

                                            <span className="shrink-0 rounded-full bg-[#faf2f6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#8f1d56]">
                                                Tag
                                            </span>
                                        </div>

                                        {tag.description ? (
                                            <p className="line-clamp-3 text-sm leading-6 text-[#615b5e]">
                                                {tag.description}
                                            </p>
                                        ) : (
                                            <p className="text-sm italic text-[#9b9498]">
                                                Sin descripción
                                            </p>
                                        )}

                                        <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#f1ebee] pt-4">
                                            {tag.id && (
                                                <div className="text-xs font-medium uppercase tracking-[0.14em] text-[#948c90]">
                                                    ID #{tag.id}
                                                </div>
                                            )}

                                            {tag.id && (
                                                <DeleteTagButton
                                                    action={deleteTagAction}
                                                    tagId={tag.id}
                                                />
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="rounded-3xl border border-dashed border-[#d8c9cf] bg-[#fcfbfb] px-8 py-14 text-center">
                                <p className="text-base font-medium text-[#4e494b]">
                                    Todavía no hay tags creadas.
                                </p>
                                <p className="mt-2 text-sm text-[#8a8387]">
                                    Cuando se creen nuevos tags aparecerán aquí.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
