import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Menu, User, LogOut, Settings } from "lucide-react";

export default function Navbar({ onToggleSidebar }) {
    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef(null);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="bg-white text-black shadow fixed top-0 left-0 w-full z-50">
            <div className="w-full px-6 py-3 flex justify-between items-center">
                
                {/* Left: Menu + Logo */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onToggleSidebar}
                        className="text-2xl p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>

                    <Link to="/user">
                        <h1 className="text-2xl font-bold text-slate-900 cursor-pointer">
                            <span className="text-blue-600">TOEIC</span>EDU
                        </h1>
                    </Link>
                </div>

                {/* Right: Notification + Avatar */}
                <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full relative">
                        <Bell size={22} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Avatar + Dropdown */}
                    <div className="relative" ref={menuRef}>
                        <div
                            onClick={() => setOpenMenu(!openMenu)}
                            className="w-10 h-10 bg-blue-200 text-blue-700 flex items-center justify-center rounded-full font-semibold cursor-pointer hover:ring-2 ring-blue-400 transition"
                        >
                            A
                        </div>

                        {openMenu && (
                            <div className="absolute right-0 mt-3 w-44 bg-white shadow-xl rounded-lg border border-gray-100 py-2 animate-fade">
                                <Link
                                    to="/user/profile"
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                                >
                                    <User size={18} />
                                    <span>Trang cá nhân</span>
                                </Link>

                                <Link
                                    to="/user/changepassword"
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition"
                                >
                                    <Settings size={18} />
                                    <span>Đổi mật khẩu</span>
                                </Link>

                                <Link
                                    to="/"
                                    onClick={() => alert("Đã đăng xuất!")}
                                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition text-left"
                                >
                                    <LogOut size={18} />
                                    <span>Đăng xuất</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
