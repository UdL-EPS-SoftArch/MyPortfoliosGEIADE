import Link from "next/link";
import { redirect } from "next/navigation";
import { UsersService } from "@/api/userApi";
import { serverAuthProvider } from "@/lib/authProvider";
import { Record } from "@/types/record";
import { RecordService } from "@/api/recordApi";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default async function UsersPage(props: { params: Promise<{ id: string }> }) {
    const userService = new UsersService(serverAuthProvider);
    const recordService = new RecordService(serverAuthProvider);
    const currentUser = await userService.getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    const user = await userService.getUserById((await props.params).id);
    let records: Record[] = [];

    try {
        records = await recordService.getRecordsByOwnedBy(user);
    } catch (error) {
        console.log(error);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main
                className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-16 py-32 dark:bg-black sm:items-start">
                <div className="flex w-full flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                    <div className="w-full space-y-4">
                        <h1 className="text-2xl font-semibold">{user.username}</h1>

                        {user.email && (
                            <p className="text-gray-700">
                                <strong>Email:</strong> {user.email}
                            </p>
                        )}

                        <h2 className="mt-8 text-xl font-semibold">Records</h2>

                        <div className="w-full space-y-3">
                            {records.map((record, i) => (
                                <Card key={i} className="w-full">
                                    <CardHeader>
                                        <CardTitle>
                                            <Link href={record.uri} className="hover:underline">
                                                {record.name}
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
