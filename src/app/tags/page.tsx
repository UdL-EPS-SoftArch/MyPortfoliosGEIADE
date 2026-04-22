import Link from "next/link";
import { TagsService } from "@/api/tagApi";
import { serverAuthProvider } from "@/lib/authProvider";

export default async function TagsPage() {
    const service = new TagsService(serverAuthProvider);
    const tags = await service.getTags();

    console.log("TAGS:", tags);

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center w-full gap-6 text-center sm:items-start sm:text-left">
                    <h1 className="text-2xl font-semibold mb-6">Tags</h1>

                    <ul className="space-y-3 w-full">
                        {tags.map((tag, index) => {
                            return (
                                <li
                                    key={tag.id ?? `${tag.name}-${index}`}
                                    className="p-4 w-full border rounded-lg bg-white shadow-sm hover:shadow transition dark:bg-black"
                                >
                                        <Link
                                            href={`/tags/${tag.id}`}
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            {tag.name}
                                        </Link>

                                    {tag.description && (
                                        <div className="text-gray-600 text-sm mt-1">
                                            {tag.description}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </main>
        </div>
    );
}