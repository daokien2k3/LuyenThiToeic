import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = login(formData.email, formData.password);
        if (!user) {
            setError("Email hoặc mật khẩu không đúng!");
            return;
        }

        // Điều hướng dựa trên role
        if (user.role === "Admin") navigate("/admin");
        else navigate("/user");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
                    Đăng nhập
                </h2>

                {error && <p className="text-red-500 text-center mb-3">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Nhập email của bạn"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Nhập mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
                    >
                        Đăng nhập
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Chưa có tài khoản?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}


// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Mail, Lock } from "lucide-react";

// export default function Login() {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({ email: "", password: "" });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log("Đăng nhập:", formData);
//         navigate("/");
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//             <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
//                 <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
//                     Đăng nhập
//                 </h2>

//                 <form onSubmit={handleSubmit} className="space-y-5">
//                     {/* Email */}
//                     <div>
//                         <label className="block font-medium text-gray-700 mb-2">
//                             Email
//                         </label>
//                         <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400">
//                             <Mail size={20} className="text-gray-500 mr-2" />
//                             <input
//                                 type="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 placeholder="Nhập email"
//                                 className="w-full bg-transparent outline-none"
//                                 required
//                             />
//                         </div>
//                     </div>

//                     {/* Password */}
//                     <div>
//                         <label className="block font-medium text-gray-700 mb-2">
//                             Mật khẩu
//                         </label>
//                         <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-400">
//                             <Lock size={20} className="text-gray-500 mr-2" />
//                             <input
//                                 type="password"
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 placeholder="Nhập mật khẩu"
//                                 className="w-full bg-transparent outline-none"
//                                 required
//                             />
//                         </div>
//                     </div>

//                     {/* Submit */}
//                     <button
//                         type="submit"
//                         className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
//                     >
//                         Đăng nhập
//                     </button>
//                 </form>

//                 <p className="text-center text-gray-600 mt-4">
//                     Chưa có tài khoản?{" "}
//                     <Link to="/register" className="text-blue-600 hover:underline">
//                         Đăng ký ngay
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// }
