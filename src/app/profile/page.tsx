"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/components/authentication";
import { ProfileService, Profile } from "@/api/profileApi";
import { clientAuthProvider } from "@/lib/authProvider";

export default function ProfilePage() {
    const { user } = useAuth();

    const service = new ProfileService(clientAuthProvider());

    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await service.getMyProfile();
                setProfile(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        if (user) load();
    }, [user]);

    async function handleSave() {
        if (!profile) return;

        const updated = await service.updateMyProfile(profile);
        setProfile(updated);
        alert("Profile updated");
    }

    if (!user) {
        return (
            <div className="p-6">
                <p>You must be logged in.</p>
            </div>
        );
    }

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="max-w-xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">My Profile</h1>

            <div className="space-y-3">
                <label className="block text-sm font-medium">
                    Description
                </label>
                <textarea
                    className="w-full border rounded p-2"
                    value={profile?.description || ""}
                    onChange={(e) =>
                        setProfile({
                            ...profile!,
                            description: e.target.value,
                        })
                    }
                />

                <label className="block text-sm font-medium">
                    Visibility
                </label>
                <select
                    className="w-full border rounded p-2"
                    value={profile?.visibility || "PRIVATE"}
                    onChange={(e) =>
                        setProfile({
                            ...profile!,
                            visibility: e.target.value as any,
                        })
                    }
                >
                    <option value="PRIVATE">PRIVATE</option>
                    <option value="PUBLIC">PUBLIC</option>
                </select>

                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Save
                </button>
            </div>
        </div>
    );
}