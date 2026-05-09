"use client";

import type { FormEvent } from "react";

type DeleteTagFromContentButtonProps = {
    action: (formData: FormData) => void | Promise<void>;
    contentId: number;
    tagId: number;
};

export default function DeleteTagFromContentButton({
    action,
    contentId,
    tagId,
}: DeleteTagFromContentButtonProps) {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        const confirmed = window.confirm(
            "¿Seguro que quieres quitar esta tag de este contenido?"
        );

        if (!confirmed) {
            event.preventDefault();
        }
    };

    return (
        <form action={action} onSubmit={handleSubmit}>
            <input type="hidden" name="contentId" value={String(contentId)} />
            <input type="hidden" name="tagId" value={String(tagId)} />
            <button
                type="submit"
                className="inline-flex items-center rounded-2xl border border-[#d7a1b7] bg-white px-3 py-2 text-xs font-semibold text-[#8f1d56] transition hover:border-[#8f1d56] hover:bg-[#fff4f7]"
            >
                Borrar
            </button>
        </form>
    );
}
