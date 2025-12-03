import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Star, LogIn } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="bg-white">

            {/* Navigation */}
            <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 shadow-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold">
                        LearningPro
                    </Link>

                    <div className="flex items-center gap-8 font-medium">
                        <Link to="/" className="hover:text-blue-200">Trang chủ</Link>
                        <Link to="/courses" className="hover:text-blue-200">Khóa học</Link>
                        <Link to="/contact" className="hover:text-blue-200">Liên hệ</Link>

                        {/* Login button */}
                        <Link
                            to="/login"
                            className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow hover:bg-blue-50 transition"
                        >
                            <LogIn size={18} /> Đăng nhập
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-24 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl font-bold leading-tight mb-4">
                        Nền tảng học & luyện thi thông minh
                    </h1>
                    <p className="text-blue-100 mb-8 text-xl">
                        Công nghệ AI giúp bạn học nhanh hơn – hiểu sâu hơn – đạt điểm cao hơn
                    </p>

                    <Link
                        to="/register"
                        className="bg-white text-blue-700 px-10 py-3 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg inline-block"
                    >
                        Bắt đầu miễn phí
                    </Link>
                </div>
            </section>

            {/* Description */}
            <section className="bg-white py-14 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Học tập hiệu quả với công nghệ hiện đại
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Chúng tôi cung cấp video bài giảng, bài kiểm tra, AI hỗ trợ và hệ thống theo dõi tiến độ học tập.
                    </p>
                </div>
            </section>

            {/* Feature Cards */}
            <section className="bg-gray-50 py-16 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { title: "Bài kiểm tra", desc: "Hàng ngàn bài tập chất lượng cao", color: "from-blue-600 to-blue-700" },
                        { title: "Học trực tuyến", desc: "Giáo viên giỏi mọi lúc", color: "from-blue-500 to-blue-600" },
                        { title: "Theo dõi tiến độ", desc: "Báo cáo kết quả chi tiết", color: "from-green-500 to-green-600" },
                        { title: "Chứng chỉ", desc: "Nhận chứng chỉ sau khi hoàn thành", color: "from-yellow-400 to-yellow-500" },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className={`bg-gradient-to-br ${item.color} text-white p-8 rounded-2xl shadow-lg`}
                        >
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="opacity-90">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Steps */}
            <section className="bg-white py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-14 text-gray-800">
                        Học tập đơn giản chỉ với 3 bước
                    </h2>

                    {[
                        { step: 1, icon: "📱", text: "Đăng ký tài khoản và chọn khóa học phù hợp", reverse: false },
                        { step: 2, icon: "📚", text: "Học video bài giảng & tài liệu chi tiết", reverse: true },
                        { step: 3, icon: "✅", text: "Làm bài kiểm tra và nhận phản hồi ngay", reverse: false },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className={`mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-2xl flex items-center gap-8 ${item.reverse ? "flex-row-reverse" : ""
                                }`}
                        >
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2">Bước {item.step}</h3>
                                <p>{item.text}</p>
                            </div>
                            <div className="w-40 h-40 bg-blue-500 rounded-xl flex items-center justify-center text-5xl">
                                {item.icon}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12">Đánh giá từ học viên</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-blue-500 p-6 rounded-xl">
                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} size={18} fill="white" className="text-yellow-300" />
                                    ))}
                                </div>
                                <p className="mb-4">Chất lượng bài giảng tuyệt vời, hỗ trợ rất nhanh!</p>
                                <p className="font-semibold">Nguyễn Văn A</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Sẵn sàng bắt đầu?</h2>
                    <p className="text-blue-100 mb-8">Tham gia ngay hôm nay và trải nghiệm miễn phí</p>

                    <Link
                        to="/register"
                        className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-flex items-center gap-2"
                    >
                        Bắt đầu học ngay <ChevronRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-16 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-gray-400">© 2025 LearningPro. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
