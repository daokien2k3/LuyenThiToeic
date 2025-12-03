import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Register() {
    const navigate = useNavigate();
    const { data, login } = useAuth();
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
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }

        // Tạo user giả lập
        const newUser = {
            ID: data.users.length + 1,
            Email: formData.email,
            Password: formData.password,
            FullName: formData.name,
            Status: "active",
            CreateAt: new Date().toISOString(),
            Token: Math.random().toString(36).substring(2),
            Phone: formData.phone,
            Address: formData.address,
            Sex: formData.sex,
            Birthday: formData.birthday,
        };

        // Thêm vào data giả lập (chỉ frontend)
        data.users.push(newUser);
        data.userRoles.push({
            ID: data.userRoles.length + 1,
            UserID: newUser.ID,
            RoleID: 3, // mặc định Student
            AssignedAt: new Date().toISOString(),
        });

        // Tự động đăng nhập sau đăng ký
        const user = login(formData.email, formData.password);
        if (user) navigate("/user");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
                    Đăng ký tài khoản
                </h2>

                {error && <p className="text-red-500 text-center mb-3">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* giữ các trường như trước */}
                    {/* ... fields như Login.js đã hiển thị trước ... */}
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Đã có tài khoản?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
}




// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Mail, User, Lock, Phone, MapPin, Calendar, Venus } from "lucide-react";

// export default function Register() {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//         sex: "",
//         birthday: "",
//         phone: "",
//         address: "",
//     });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         if (formData.password !== formData.confirmPassword) {
//             alert("Mật khẩu xác nhận không khớp!");
//             return;
//         }

//         const user = {
//             ...formData,
//             createdAt: new Date().toISOString(),
//             status: "active",
//             token: Math.random().toString(36).substring(2)
//         };

//         console.log("Thông tin đăng ký:", user);

//         alert("Đăng ký thành công!");
//         navigate("/login");
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//             <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl border border-gray-200">
//                 <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
//                     Đăng ký tài khoản
//                 </h2>

//                 <form onSubmit={handleSubmit} className="space-y-5">
//                     {/* Name */}
//                     <div>
//                         <label className="font-medium text-gray-700 mb-2 block">Họ và tên</label>
//                         <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
//                             <User className="text-gray-500 mr-2" size={20} />
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleChange}
//                                 placeholder="Nhập họ và tên"
//                                 className="w-full bg-transparent outline-none"
//                                 required
//                             />
//                         </div>
//                     </div>

//                     {/* Email */}
//                     <div>
//                         <label className="font-medium text-gray-700 mb-2 block">Email</label>
//                         <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
//                             <Mail className="text-gray-500 mr-2" size={20} />
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

//                     {/* Password - Confirm password */}
//                     <div className="grid grid-cols-2 gap-3">
//                         <div>
//                             <label className="font-medium text-gray-700 mb-2 block">
//                                 Mật khẩu
//                             </label>
//                             <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
//                                 <Lock className="text-gray-500 mr-2" size={20} />
//                                 <input
//                                     type="password"
//                                     name="password"
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     placeholder="Tạo mật khẩu"
//                                     className="w-full bg-transparent outline-none"
//                                     required
//                                 />
//                             </div>
//                         </div>

//                         <div>
//                             <label className="font-medium text-gray-700 mb-2 block">
//                                 Xác nhận
//                             </label>
//                             <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
//                                 <Lock className="text-gray-500 mr-2" size={20} />
//                                 <input
//                                     type="password"
//                                     name="confirmPassword"
//                                     value={formData.confirmPassword}
//                                     onChange={handleChange}
//                                     placeholder="Nhập lại"
//                                     className="w-full bg-transparent outline-none"
//                                     required
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Sex + Birthday */}
//                     <div className="grid grid-cols-2 gap-3">
//                         <div>
//                             <label className="font-medium text-gray-700 mb-2 block">
//                                 Giới tính
//                             </label>
//                             <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
//                                 <Venus className="text-gray-500 mr-2" size={20} />
//                                 <select
//                                     name="sex"
//                                     value={formData.sex}
//                                     onChange={handleChange}
//                                     className="w-full bg-transparent outline-none"
//                                 >
//                                     <option value="">-- Chọn --</option>
//                                     <option value="Nam">Nam</option>
//                                     <option value="Nữ">Nữ</option>
//                                     <option value="Khác">Khác</option>
//                                 </select>
//                             </div>
//                         </div>

//                         <div>
//                             <label className="font-medium text-gray-700 mb-2 block">Ngày sinh</label>
//                             <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
//                                 <Calendar className="text-gray-500 mr-2" size={20} />
//                                 <input
//                                     type="date"
//                                     name="birthday"
//                                     value={formData.birthday}
//                                     onChange={handleChange}
//                                     className="w-full bg-transparent outline-none"
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Phone */}
//                     <div>
//                         <label className="font-medium text-gray-700 mb-2 block">
//                             Số điện thoại
//                         </label>
//                         <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
//                             <Phone className="text-gray-500 mr-2" size={20} />
//                             <input
//                                 type="tel"
//                                 name="phone"
//                                 value={formData.phone}
//                                 onChange={handleChange}
//                                 placeholder="Nhập số điện thoại"
//                                 className="w-full bg-transparent outline-none"
//                                 required
//                             />
//                         </div>
//                     </div>

//                     {/* Address */}
//                     <div>
//                         <label className="font-medium text-gray-700 mb-2 block">
//                             Địa chỉ
//                         </label>
//                         <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50">
//                             <MapPin className="text-gray-500 mr-2" size={20} />
//                             <input
//                                 type="text"
//                                 name="address"
//                                 value={formData.address}
//                                 onChange={handleChange}
//                                 placeholder="Nhập địa chỉ"
//                                 className="w-full bg-transparent outline-none"
//                                 required
//                             />
//                         </div>
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full bg-blue-600 text-white font-semibold py-2 mt-2 rounded-lg hover:bg-blue-700 transition"
//                     >
//                         Đăng ký
//                     </button>
//                 </form>

//                 <p className="text-center text-gray-600 mt-4">
//                     Đã có tài khoản?{" "}
//                     <Link to="/login" className="text-blue-600 hover:underline">
//                         Đăng nhập
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// }
