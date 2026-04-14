"use client";

import Link from "next/link";
import { useAuth } from "@/app/components/authentication";

export default function Home() {
  const { user } = useAuth();

  const roles = user?.authorities?.map(a => a.authority) ?? [];

  const isAdmin = roles.includes("ROLE_ADMIN");
  const isCreator = roles.includes("ROLE_CREATOR");

  // wrapper SOLO para ancho, no para centrar vertical
  const Page = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full max-w-5xl mx-auto px-6 py-10">
      {children}
    </div>
  );

  const Card = ({ children, href }: any) => (
    <Link
      href={href}
      className="
        rounded-xl border border-zinc-200 dark:border-zinc-800
        bg-white dark:bg-zinc-900
        p-6 shadow-sm
        hover:shadow-md hover:-translate-y-1
        transition
      "
    >
      {children}
    </Link>
  );

  const Badge = ({ children }: any) => (
    <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
      {children}
    </span>
  );

  // 👤 GUEST
  if (!user) {
    return (
      <Page>
        <div className="flex flex-col items-center text-center py-20">
          <h1 className="text-4xl font-bold">Welcome 👋</h1>
          <p className="text-zinc-500 mt-2">
            Sign in to access your dashboard
          </p>

          <div className="mt-8 flex gap-3">
            <Link
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              href="/login"
            >
              Login
            </Link>

            <Link
              className="px-5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700"
              href="/users/register"
            >
              Register
            </Link>
          </div>
        </div>
      </Page>
    );
  }

  // 🛡 ADMIN
  if (isAdmin) {
    return (
      <Page>
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-zinc-500 mt-2">
              System administration panel
            </p>
            <div className="mt-3">
              <Badge>ADMIN</Badge>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <Card href="/creators">
              <h2 className="font-semibold">Manage Creators</h2>
              <p className="text-sm text-zinc-500 mt-1">
                Suspend or manage creators
              </p>
            </Card>

            <Card href="/admins">
              <h2 className="font-semibold">Admins</h2>
              <p className="text-sm text-zinc-500 mt-1">
                Admin management panel
              </p>
            </Card>
          </div>
        </div>
      </Page>
    );
  }

  // 🎬 CREATOR
  if (isCreator) {
    return (
      <Page>
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="text-4xl font-bold">Creator Dashboard</h1>
            <p className="text-zinc-500 mt-2">
              Manage your content
            </p>
            <div className="mt-3">
              <Badge>CREATOR</Badge>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <Card href={`/creators/${user.username}`}>
              <h2 className="font-semibold">My Profile</h2>
              <p className="text-sm text-zinc-500 mt-1">
                View your profile
              </p>
            </Card>

            <Card href="/creators/content">
              <h2 className="font-semibold">My Content</h2>
              <p className="text-sm text-zinc-500 mt-1">
                Manage posts
              </p>
            </Card>
          </div>
        </div>
      </Page>
    );
  }

  // 👤 USER DEFAULT
  return (
    <Page>
      <div className="flex flex-col items-center text-center py-16">
        <h1 className="text-3xl font-bold">
          Hello {user.username}
        </h1>

        <Link
          href={`/users/${user.username}`}
          className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-lg"
        >
          Go to profile
        </Link>
      </div>
    </Page>
  );
}