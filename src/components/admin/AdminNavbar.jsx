import { Menu } from "lucide-react";

export default function AdminNavbar({ onToggleSidebar }) {
    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md flex items-center px-6 z-50">
            <button
                onClick={onToggleSidebar}
                className="p-2 mr-4 rounded-md hover:bg-gray-100 transition-colors"
            >
                <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Admin</h1>
        </nav>
    );
}
