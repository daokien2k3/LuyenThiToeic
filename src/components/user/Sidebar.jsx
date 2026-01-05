import { X, BookOpen, ClipboardList } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation();

    useEffect(() => {
        // Lắng nghe message "ready" từ cửa sổ con
        const handleReady = (event) => {
            // Chấp nhận message từ cả port 5174 và 3000
            if (event.origin !== "http://localhost:3000") {
                return;
            }
            
            if (event.data.type === "ready") {
                const accessToken = localStorage.getItem("accessToken");
                
                // Gửi token về cửa sổ con
                event.source.postMessage(
                    { type: "auth", accessToken },
                    event.origin  // Gửi về đúng origin của cửa sổ con
                );
                
                console.log(`✅ Token sent to ${event.origin}:`, accessToken);
            }
        };

        window.addEventListener("message", handleReady);

        return () => {
            window.removeEventListener("message", handleReady);
        };
    }, []);

    const handleOpenStudy = () => {
        // Mở port 3000 thay vì 5174
        window.open("http://localhost:3000/home/main", "_blank");
    };

    return (
        <div
            className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl border-r transform
                ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                transition-transform duration-300 z-40 flex flex-col`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-200 rounded-full text-gray-700"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Nội dung chính */}
            <nav className="flex flex-col mt-4 space-y-2 px-4">
                {/* TOEIC Study */}
                <button
                    onClick={handleOpenStudy}
                    className="flex items-center space-x-3 px-4 py-2 rounded-lg transition-all
                    text-gray-800 hover:bg-gray-100 hover:text-blue-600"
                >
                    <BookOpen size={20} />
                    <span>TOEIC Study</span>
                </button>

                {/* TOEIC Practice */}
                <Link
                    to="/user/tests"
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all
                        ${location.pathname === "/user/tests"
                            ? "bg-blue-100 text-blue-600 font-medium"
                            : "text-gray-800 hover:bg-gray-100 hover:text-blue-600"
                        }`}
                >
                    <ClipboardList size={20} />
                    <span>TOEIC Practice</span>
                </Link>
            </nav>
        </div>
    );
}

// import { X, BookOpen, ClipboardList } from "lucide-react";
// import { Link, useLocation } from "react-router-dom";

// export default function Sidebar({ isOpen, onClose }) {
//     const location = useLocation();

//     const menuItems = [
//         { name: "TOEIC Study", icon: <BookOpen size={20} />, path: "http://localhost:3000", external: true },
//         { name: "TOEIC Practice", icon: <ClipboardList size={20} />, path: "/user/tests" },
//     ];

//     return (
//         <div
//             className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl border-r transform
//                 ${isOpen ? "translate-x-0" : "-translate-x-full"} 
//                 transition-transform duration-300 z-40 flex flex-col`}
//         >
//             {/* Header */}
//             <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
//                 <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
//                 <button
//                     onClick={onClose}
//                     className="p-2 hover:bg-gray-200 rounded-full text-gray-700"
//                 >
//                     <X size={20} />
//                 </button>
//             </div>

//             {/* Nội dung chính */}
//             <nav className="flex flex-col mt-4 space-y-2 px-4">
//                 {menuItems.map((item) => (
//                     item.external ? (
//                         <a
//                             key={item.name}
//                             href={item.path}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="flex items-center space-x-3 px-4 py-2 rounded-lg transition-all text-gray-800 hover:bg-gray-100 hover:text-blue-600"
//                         >
//                             {item.icon}
//                             <span>{item.name}</span>
//                         </a>
//                     ) : (
//                         <Link
//                             key={item.name}
//                             to={item.path}
//                             className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all
//                             ${location.pathname === item.path
//                                     ? "bg-blue-100 text-blue-600 font-medium"
//                                     : "text-gray-800 hover:bg-gray-100 hover:text-blue-600"
//                                 }`}
//                         >
//                             {item.icon}
//                             <span>{item.name}</span>
//                         </Link>
//                     )
//                 ))}
//             </nav>
//         </div>
//     );
// }