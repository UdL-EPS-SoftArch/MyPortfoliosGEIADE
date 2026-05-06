"use client";

import { useEffect, useState } from "react";
import { CreatorService } from "@/api/creatorAPI";
import { clientAuthProvider } from "@/lib/authProvider";
import { User } from "@/types/user";
import CreatorCard from "../components/CreatorCard";

export default function CreatorsAdminPage() {
    const service = new CreatorService(clientAuthProvider());
    const [creators, setCreators] = useState<User[]>([]);

    const load = async () => {
        const data = await service.getCreators();
        setCreators(data);
    };

    useEffect(() => {
        load();
    }, []);

    const suspend = async (username: string) => {
        await service.suspendCreator(username);
        await load();
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Creators</h1>

            <ul className="space-y-4">
                {creators.map((c) => (
                    <CreatorCard
                        key={c.username}
                        creator={c}
                        onSuspend={suspend}
                    />
                ))}
            </ul>
        </div>
    );
}