"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/components/authentication";
import { ProfileService, Profile } from "@/api/profileAPI";
import { clientAuthProvider } from "@/lib/authProvider";
import { toast } from "sonner";
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
        toast.success("Profile updated");    }

    if (!user) {
        return (
            <div className="w-full pt-6 px-6">
                <p className="text-gray-600">You must be logged in.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="w-full pt-6 px-6">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="w-full flex justify-center pt-6 px-4">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-6 space-y-6">

                <h1 className="text-2xl font-bold">My Profile</h1>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={profile?.description || ""}
                        onChange={(e) =>
                            setProfile({
                                ...profile!,
                                description: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Visibility</label>
                    <select
                        className="w-full border rounded-lg p-3"
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
                </div>

                <button
                    onClick={handleSave}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Save changes
                </button>

            </div>
        </div>
    );
}