import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, User, Lock, Phone, MapPin, Calendar, Venus } from "lucide-react";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        sex: "",
        birthday: "",
        phone: "",
        address: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        const user = {
            ...formData,
            createdAt: new Date().toISOString(),
            status: "active",
            token: Math.random().toString(36).substring(2)
        };

        console.log("Thông tin đăng ký:", user);
        alert("Đăng ký thành công!");
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
            <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-2xl border border-blue-100">
                <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-8 tracking-tight">
                    Tạo tài khoản mới
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Name */}
                    <div>
                        <label className="font-medium text-gray-800 mb-1 block">Họ và tên</label>
                        <div className="input-box">
                            <User className="icon" size={20} />
                            <input
                                type="text"
                                name="name"
                                placeholder="Nhập họ và tên"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="font-medium text-gray-800 mb-1 block">Email</label>
                        <div className="input-box">
                            <Mail className="icon" size={20} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Nhập email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Passwords */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="font-medium text-gray-800 mb-1 block">Mật khẩu</label>
                            <div className="input-box">
                                <Lock className="icon" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Tạo mật khẩu"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="font-medium text-gray-800 mb-1 block">Xác nhận</label>
                            <div className="input-box">
                                <Lock className="icon" size={20} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Nhập lại mật khẩu"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sex + Birthday */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="font-medium text-gray-800 mb-1 block">Giới tính</label>
                            <div className="input-box">
                                <Venus className="icon" size={20} />
                                <select
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Chọn giới tính --</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="font-medium text-gray-800 mb-1 block">Ngày sinh</label>
                            <div className="input-box">
                                <Calendar className="icon" size={20} />
                                <input
                                    type="date"
                                    name="birthday"
                                    value={formData.birthday}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="font-medium text-gray-800 mb-1 block">Số điện thoại</label>
                        <div className="input-box">
                            <Phone className="icon" size={20} />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Nhập số điện thoại"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="font-medium text-gray-800 mb-1 block">Địa chỉ</label>
                        <div className="input-box">
                            <MapPin className="icon" size={20} />
                            <input
                                type="text"
                                name="address"
                                placeholder="Nhập địa chỉ"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 transition-all"
                    >
                        Đăng ký
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                    Đã có tài khoản?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                        Đăng nhập ngay
                    </Link>
                </p>
            </div>

            {/* Custom styles */}
            <style>
                {`
                .input-box {
                    display: flex;
                    align-items: center;
                    border: 1px solid #cbd5e1;
                    padding: 10px 14px;
                    border-radius: 10px;
                    background: #f8fafc;
                    transition: all 0.2s;
                }
                .input-box:hover {
                    border-color: #60a5fa;
                }
                .input-box:focus-within {
                    border-color: #3b82f6;
                    background: #eef6ff;
                }
                .input-box input,
                .input-box select {
                    width: 100%;
                    background: transparent;
                    outline: none;
                    font-size: 16px;
                }
                .icon {
                    margin-right: 10px;
                    color: #6b7280;
                }
                `}
            </style>
        </div>
    );
}
