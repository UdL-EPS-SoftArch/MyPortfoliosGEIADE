import Link from "next/link";
import { serverAuthProvider } from "@/lib/authProvider";
import { ContentService } from "@/api/contentApi";
import { Content } from "@/types/content";

export default async function ContentsPage() {
    const contentService = new ContentService(serverAuthProvider);
    const contents: Content[] = await contentService.getContents();

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center w-full gap-6 text-center sm:items-start sm:text-left">
                    <div className="space-y-4 w-full">
                        <h1 className="text-2xl font-semibold">Contents</h1>

                        <ul className="space-y-3 w-full">
                            {contents.map((content) => {
                                // 👇 Esto NO rompe y nos dice si existe el self link
                                console.log("SELF LINK:", content.link("self"));

                                const selfHref = content.link("self")?.href;
                                const id = selfHref?.split("/").pop();

                                return (
                                    <li key={selfHref}>
                                        <Link
                                            href={`/contents/${id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {content.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
