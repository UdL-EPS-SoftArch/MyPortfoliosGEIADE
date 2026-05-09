"use client";

import { useEffect, useState } from "react";
import { CreatorService } from "@/api/creatorAPI";
import { clientAuthProvider } from "@/lib/authProvider";
import { User } from "@/types/user";
import CreatorCard from "../components/CreatorCard";

export default function CreatorsAdminPage() {
    const [creators, setCreators] = useState<User[]>([]);

    async function load() {
        const service = new CreatorService(clientAuthProvider());
        const data = await service.getCreators();
        setCreators(data);
    }

    useEffect(() => {
        let mounted = true;
        const service = new CreatorService(clientAuthProvider());

        service.getCreators().then((data) => {
            if (mounted) {
                setCreators(data);
            }
        });

        return () => {
            mounted = false;
        };
    }, []);

    const suspend = async (username: string) => {
        const service = new CreatorService(clientAuthProvider());
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
