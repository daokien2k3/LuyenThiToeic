import { Link } from "react-router-dom";
import { Bell, Menu } from "lucide-react";

export default function Navbar({ onToggleSidebar }) {
    return (
        <nav className="bg-white text-black shadow fixed top-0 left-0 w-full z-50">
            <div className="w-full px-6 py-3 flex justify-between items-center">
                {/* Nhóm bên trái: menu + logo */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onToggleSidebar}
                        className="text-2xl p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                    <Link
                        to="/user"
                        className="text-2xl font-bold hover:text-blue-600 transition-colors text-blue-700"
                    >
                        TOEIC Practice
                    </Link>
                </div>

                {/* Nhóm bên phải: thông báo + avatar hoặc đăng nhập */}
                <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Bell size={22} />
                    </button>
                    <Link
                        to="/login"
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </nav>
    );
}
