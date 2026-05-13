'use client'

export default function Sidebar() {
    return (
        <aside
            className="
                    fixed left-0 top-16 bottom-0
                    z-40
                    w-60
                    border-r border-zinc-200
                    bg-white
                "
        >
            <div className="p-4">
                Sidebar
            </div>
        </aside>
    );
}