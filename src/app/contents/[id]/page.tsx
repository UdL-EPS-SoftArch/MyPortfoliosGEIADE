import { serverAuthProvider } from "@/lib/authProvider";
import { ContentService } from "@/api/contentApi";

export default async function ContentPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;  // 👈 NECESARIO EN NEXT 15/16

    const contentService = new ContentService(serverAuthProvider);
    const content = await contentService.getContentById(id);

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold">{content.name}</h1>

            {content.description && (
                <p className="mt-2 text-gray-600">{content.description}</p>
            )}
        </div>
    );
}
