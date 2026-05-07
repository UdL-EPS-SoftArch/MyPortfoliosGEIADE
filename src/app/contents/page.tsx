import Link from "next/link";
import { serverAuthProvider } from "@/lib/authProvider";
import { ContentService } from "@/api/contentApi";
import ContentsList from "./ContentsList";
import { Content } from "@/types/content";
import { FlatContent } from "@/types/content";

export default async function ContentsPage() {
    const contentService = new ContentService(serverAuthProvider);
    const rawContents = await contentService.getContents();

    const contents: FlatContent[] = rawContents.map((c: Content) => {
    const selfHref = c.link("self")?.href ?? ""; 

    return {
        uri: selfHref,
        contentId: selfHref.split("/").pop() ?? "",
        name: c.name,
        description: c.description,
        body: c.body,
        visibility: c.visibility,
    };
});

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col py-20 px-10 bg-white dark:bg-black">

                {/* HEADER */}
                <div className="flex w-full items-center justify-between mb-10">
                    <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
                        Contents
                    </h1>

                    <Link
                        href="/contents/create"
                        className="rounded-full bg-blue-600 px-5 py-2 text-white font-medium hover:bg-blue-700 transition"
                    >
                        + Create Content
                    </Link>
                </div>

                {/* LIST + SEARCH */}
                <ContentsList contents={contents} />
            </main>
        </div>
    );
}




