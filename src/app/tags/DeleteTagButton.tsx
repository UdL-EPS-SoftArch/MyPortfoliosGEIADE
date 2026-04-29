"use client";

import type { FormEvent } from "react";

type DeleteTagButtonProps = {
    action: (formData: FormData) => void | Promise<void>;
    tagId: number;
};

export default function DeleteTagButton({ action, tagId }: DeleteTagButtonProps) {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        const confirmed = window.confirm(
            "Seguro que quieres eliminar esta tag? Esta accion no se puede deshacer."
        );

        if (!confirmed) {
            event.preventDefault();
        }
    };

    return (
        <form action={action} onSubmit={handleSubmit}>
            <input type="hidden" name="tagId" value={String(tagId)} />
            <button
                type="submit"
                className="inline-flex items-center rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:border-red-500 hover:bg-red-100"
            >
                Eliminar tag
            </button>
        </form>
    );
}
