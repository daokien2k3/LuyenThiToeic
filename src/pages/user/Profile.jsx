import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaClock,
  FaBullseye,
  FaEdit,
  FaSave,
  FaChartBar,
  FaEye,
  FaTrophy,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("info");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_API_URL;
  const token = import.meta.env.VITE_STUDENT_TOKEN;

  useEffect(() => {
    fetchUserData();
    fetchAttemptHistory();
  }, []);

  const fetchUserData = async () => {
    try {
      // TODO: Thay đổi API endpoint này theo backend của bạn
      // Ví dụ: const response = await fetch(`${baseUrl}/users/me`, {...})
      
      // Tạm thời dùng dữ liệu mock
      const mockUser = {
        ID: 1,
        FullName: "Nguyễn Văn A",
        Email: "user@example.com",
        Sex: "Nam",
        Phone: "0123456789",
        Birthday: "2000-01-01",
        Address: "Hà Nội",
        CreateAt: "2024-01-01"
      };
      
      const mockProfile = {
        ID: 1,
        UserID: 1,
        TargetScore: 800,
        PlacementLevel: "Intermediate"
      };

      setUser(mockUser);
      setEditedUser(mockUser);
      setProfile(mockProfile);
    } catch (err) {
      console.error("Lỗi khi tải thông tin người dùng:", err);
    }
  };

  const fetchAttemptHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/attempts/history?submittedOnly=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải lịch sử thi');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const formattedResults = data.data.map((attempt) => {
          const totalScore = (attempt.ScoreReading || 0) + (attempt.ScoreListening || 0);
          const startTime = new Date(attempt.StartedAt);
          const endTime = new Date(attempt.SubmittedAt);
          const timeTest = Math.round((endTime - startTime) / 60000);

          return {
            ID: attempt.ID,
            ExamId: attempt.ExamID,
            title: attempt.exam?.Title || "Bài thi không có tiêu đề",
            totalScore,
            ScoreReading: attempt.ScoreReading || 0,
            ScoreListening: attempt.ScoreListening || 0,
            ScorePercent: attempt.ScorePercent || 0,
            startAt: new Date(attempt.StartedAt).toLocaleString('vi-VN'),
            finishAt: new Date(attempt.SubmittedAt).toLocaleString('vi-VN'),
            timeTest,
            Type: attempt.Type,
            examType: attempt.exam?.examType?.Description || "Không rõ"
          };
        });

        setResults(formattedResults);
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch sử thi:", err);
      alert("Không thể tải lịch sử thi. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => setEditMode(!editMode);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = () => {
    // TODO: Gọi API để lưu thông tin user
    // await fetch(`${baseUrl}/users/update`, {...})
    setUser(editedUser);
    setEditMode(false);
    alert("Cập nhật thông tin thành công!");
  };

  const handleViewResult = (id) => navigate(`/user/result/${id}`);
  const handleViewStatistics = () => navigate("/user/statistics");

  if (!user || !profile) {
    return (
      <div className="text-center py-20 text-gray-400 italic">
        Đang tải dữ liệu người dùng...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        {/* Avatar + Icon chỉnh sửa */}
        <div className="flex flex-col items-center mb-8 relative">
          {/* Avatar */}
          <div className="relative">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="avatar"
              className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg"
            />

            {/* Icon bút */}
            <button
              onClick={editMode ? handleSave : handleEditToggle}
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700 transition-all"
              title={editMode ? "Lưu thay đổi" : "Chỉnh sửa thông tin"}
            >
              {editMode ? <FaSave /> : <FaEdit />}
            </button>
          </div>

          {/* Name + Email */}
          <h2 className="text-3xl font-bold text-blue-700 mt-4">{user.FullName}</h2>
          <p className="text-gray-500">{user.Email}</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 rounded-lg overflow-hidden shadow-sm">
          <button
            className={`flex-1 py-2 font-semibold transition-all ${
              activeTab === "info"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("info")}
          >
            Thông tin cá nhân
          </button>
          <button
            className={`flex-1 py-2 font-semibold transition-all ${
              activeTab === "history"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Lịch sử luyện thi
          </button>
        </div>

        {/* Nội dung tab */}
        {activeTab === "info" ? (
          <div className="bg-gray-50 p-8 rounded-2xl shadow-inner space-y-4 relative">
            {/* Thông tin cá nhân */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <FaUser className="text-blue-600" />
                {editMode ? (
                  <input
                    type="text"
                    name="Sex"
                    value={editedUser.Sex}
                    onChange={handleChange}
                    className="border rounded-md px-2 py-1 w-full"
                  />
                ) : (
                  <span className="font-medium">Giới tính: {user.Sex}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <FaPhone className="text-blue-600" />
                {editMode ? (
                  <input
                    type="text"
                    name="Phone"
                    value={editedUser.Phone}
                    onChange={handleChange}
                    className="border rounded-md px-2 py-1 w-full"
                  />
                ) : (
                  <span className="font-medium">{user.Phone}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <FaBirthdayCake className="text-blue-600" />
                {editMode ? (
                  <input
                    type="date"
                    name="Birthday"
                    value={editedUser.Birthday}
                    onChange={handleChange}
                    className="border rounded-md px-2 py-1 w-full"
                  />
                ) : (
                  <span className="font-medium">{user.Birthday}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-600" />
                {editMode ? (
                  <input
                    type="text"
                    name="Address"
                    value={editedUser.Address}
                    onChange={handleChange}
                    className="border rounded-md px-2 py-1 w-full"
                  />
                ) : (
                  <span className="font-medium">{user.Address}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <FaClock className="text-blue-600" />
                <span className="font-medium">Thành viên từ: {user.CreateAt}</span>
              </div>

              <div className="flex items-center gap-2">
                <FaBullseye className="text-blue-600" />
                {editMode ? (
                  <input
                    type="number"
                    name="TargetScore"
                    value={profile.TargetScore || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, TargetScore: e.target.value })
                    }
                    className="border rounded-md px-2 py-1 w-full"
                    placeholder="Nhập mục tiêu"
                  />
                ) : (
                  <span className="font-medium">
                    Mục tiêu TOEIC:{" "}
                    <span className="text-blue-700 font-semibold">
                      {profile.TargetScore
                        ? `${profile.TargetScore} điểm`
                        : "Chưa đặt mục tiêu"}
                    </span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <FaBullseye className="text-blue-600" />
                <span className="font-medium">
                  Cấp độ:{" "}
                  <span className="text-blue-700 font-semibold">{profile.PlacementLevel}</span>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-2xl shadow-inner text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-blue-700">
                Lịch sử các bài luyện thi
              </h3>
              <button
                onClick={handleViewStatistics}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all"
              >
                <FaChartBar /> Xem thống kê
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Đang tải lịch sử thi...
              </div>
            ) : results.length > 0 ? (
              <ul className="space-y-4">
                {results.map((r) => (
                  <li
                    key={r.ID}
                    className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                      <div>
                        <p className="font-semibold text-blue-700 text-lg">
                          {r.title} (#{r.ExamId})
                        </p>
                        <p className="text-gray-500 text-sm">
                          {r.examType}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Làm bài: {r.startAt} → {r.finishAt}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-2 md:mt-0">
                        <FaTrophy className="text-yellow-500" />
                        <span className="text-lg font-bold text-green-600">
                          {r.totalScore} điểm
                        </span>
                        <button
                          onClick={() => handleViewResult(r.ID)}
                          className="bg-gray-200 hover:bg-blue-500 hover:text-white text-gray-700 px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-all"
                        >
                          <FaEye /> Xem chi tiết
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-6 text-gray-600 text-sm mt-2">
                      <span>
                        📖 Reading: {r.ScoreReading}
                      </span>
                      <span>
                        🎧 Listening: {r.ScoreListening}
                      </span>
                      <span>
                        📊 Tỷ lệ: {r.ScorePercent}%
                      </span>
                      <span>⏱ Thời gian: {r.timeTest} phút</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">Chưa có lịch sử làm bài.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}