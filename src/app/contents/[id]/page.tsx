import Link from "next/link";
import { serverAuthProvider } from "@/lib/authProvider";
import { ContentService } from "@/api/contentApi";

export default async function ContentPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;

    const contentService = new ContentService(serverAuthProvider);
    const content = await contentService.getContentById(id);

    return (
        <div className="p-10 space-y-6">
            {/* TÍTULO */}
            <h1 className="text-3xl font-bold">{content.name}</h1>

            {/* SUBTÍTULO */}
            <h2 className="text-xl text-gray-600">{content.description}</h2>

            {/* TEXTO PRINCIPAL */}
            <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                {content.body}
            </p>

            {/* BOTÓN REPORTAR */}
            <Link
                href={`/contents/${id}/report`}
                className="inline-block mt-6 rounded-full bg-red-600 px-5 py-2 text-white font-medium hover:bg-red-700 transition"
            >
                Report this content
            </Link>
        </div>
    );
}
