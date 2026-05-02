"use client";

export default function AssignContentToggle() {

    const handleClick = () => {
        const panel = document.getElementById("assign-content-panel");
        if (!panel) return;

        panel.classList.toggle("hidden");
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center rounded-2xl border border-[#c88aa6] bg-white px-4 py-3 text-sm font-semibold text-[#8f1d56] transition hover:border-[#8f1d56] hover:bg-[#faf3f6]"
        >
            Asignar content
        </button>
    );
}
