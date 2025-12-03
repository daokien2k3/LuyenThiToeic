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
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const currentUserId = 3; // ví dụ user hiện tại

    fetch("/data/toeicPractice.json")
      .then((res) => res.json())
      .then((data) => {
        const foundUser = data.users.find((u) => u.ID === currentUserId);
        setUser(foundUser);
        setEditedUser(foundUser);

        const studentProfile = data.studentProfiles.find(
          (p) => p.UserID === currentUserId
        );
        setProfile(studentProfile);

        const userAttempts = data.attempts
          .filter((a) => a.StudentProfileID === studentProfile?.ID)
          .map((a) => {
            const exam = data.exams.find((e) => e.ID === a.ExamID);
            const attemptAnswers = data.attemptAnswers.filter(
              (ans) => ans.AttemptID === a.ID
            );
            const correctQuestion = attemptAnswers.filter(
              (ans) => ans.IsCorrect
            ).length;
            const incorrectQuestion = attemptAnswers.filter(
              (ans) => !ans.IsCorrect
            ).length;

            return {
              ...a,
              ExamId: exam?.ID,
              title: exam?.Title,
              totalScore: a.ScoreReading + a.ScoreListening,
              startAt: a.StartedAt,
              finishAt: a.SubmittedAt,
              correctQuestion,
              incorrectQuestion,
              timeTest: Math.round(
                (new Date(a.SubmittedAt) - new Date(a.StartedAt)) / 60000
              )
            };
          });

        setResults(userAttempts);
      })
      .catch((err) => console.error("Lỗi khi tải dữ liệu:", err));
  }, []);

  const handleEditToggle = () => setEditMode(!editMode);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = () => {
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
        {/* Avatar và tên */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="avatar"
            className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg mb-4"
          />
          <h2 className="text-3xl font-bold text-blue-700">{user.FullName}</h2>
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
            <button
              onClick={editMode ? handleSave : handleEditToggle}
              className="absolute top-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-all"
            >
              {editMode ? (
                <>
                  <FaSave /> Lưu thay đổi
                </>
              ) : (
                <>
                  <FaEdit /> Chỉnh sửa
                </>
              )}
            </button>

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

            {results.length > 0 ? (
              <ul className="space-y-4">
                {results.map((r) => (
                  <li
                    key={r.ID}
                    className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                      <div>
                        <p className="font-semibold text-blue-700 text-lg">{r.title} (#{r.ExamId})</p>
                        <p className="text-gray-500 text-sm">
                          Làm bài: {r.startAt} → {r.finishAt}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-2 md:mt-0">
                        <FaTrophy className="text-yellow-500" />
                        <span className="text-lg font-bold text-green-600">{r.totalScore} điểm</span>
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
                        <FaCheckCircle className="inline mr-1 text-green-500" /> Đúng: {r.correctQuestion}
                      </span>
                      <span>
                        <FaTimesCircle className="inline mr-1 text-red-500" /> Sai: {r.incorrectQuestion}
                      </span>
                      <span>⏱ Thời gian làm bài: {r.timeTest} phút</span>
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
