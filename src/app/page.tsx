import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col justify-center gap-8 py-20 px-16 bg-white dark:bg-black sm:items-start">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            MyPortfolios Frontend
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Temporary frontend workspace with direct access to administration views while the portfolio flow is still pending.
          </p>
        </div>

        <div className="grid w-full gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Projects Admin</CardTitle>
              <CardDescription>
                Temporary admin view to create projects directly and list the existing ones from the backend API.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/admin/projects">Open Projects Admin</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
