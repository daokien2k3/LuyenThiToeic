import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
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

        if (user.role === "Admin") navigate("/admin");
        else navigate("/user");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-100 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-blue-200">
                <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
                    Đăng nhập
                </h2>

                {error && (
                    <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4 text-center border border-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                            <Mail className="text-gray-500 mr-2" size={20} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Nhập email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-transparent outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-2">
                            Mật khẩu
                        </label>
                        <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                            <Lock className="text-gray-500 mr-2" size={20} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Nhập mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-transparent outline-none"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-lg font-semibold
                                   hover:bg-blue-700 active:scale-95 transition-all shadow-md"
                    >
                        Đăng nhập
                    </button>
                </form>

                <p className="text-center text-gray-700 mt-6 text-sm">
                    Chưa có tài khoản?{" "}
                    <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    );
}
