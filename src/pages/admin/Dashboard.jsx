import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";
import {
    BookOpen,
    MessageSquare,
    TrendingUp,
    Target,
    FileText,
    AlertCircle,
    ArrowUp,
    RefreshCw
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalExams: 0,
        totalComments: 0,
        totalMediaGroups: 0,
        totalQuestions: 0,
        totalAttempts: 0,
        totalExamTypes: 0
    });

    const [exams, setExams] = useState([]);
    const [comments, setComments] = useState([]);
    const [mediaGroups, setMediaGroups] = useState([]);
    const [examTypes, setExamTypes] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get token from localStorage
            const token = localStorage.getItem("accessToken");
            
            if (!token) {
                throw new Error("No access token found. Please login again.");
            }

            // Headers with authorization
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Fetch all data in parallel
            const [examsRes, commentsRes, mediaGroupsRes, examTypesRes] = await Promise.all([
                fetch(`${API_URL}/exams`, { headers }).then(r => {
                    if (!r.ok) throw new Error(`Failed to fetch exams: ${r.status}`);
                    return r.json();
                }),
                fetch(`${API_URL}/comments`, { headers }).then(r => {
                    if (!r.ok) throw new Error(`Failed to fetch comments: ${r.status}`);
                    return r.json();
                }),
                fetch(`${API_URL}/media-groups`, { headers }).then(r => {
                    if (!r.ok) throw new Error(`Failed to fetch media groups: ${r.status}`);
                    return r.json();
                }),
                fetch(`${API_URL}/exam-types`, { headers }).then(r => {
                    if (!r.ok) throw new Error(`Failed to fetch exam types: ${r.status}`);
                    return r.json();
                })
            ]);

            setExams(examsRes.data || []);
            setComments(commentsRes.data || []);
            setMediaGroups(mediaGroupsRes.data || []);
            setExamTypes(examTypesRes.data || []);

            // Calculate statistics
            const totalQuestions = (mediaGroupsRes.data || []).reduce((sum, mg) => sum + mg.QuestionCount, 0);
            const totalAttempts = (mediaGroupsRes.data || []).reduce((sum, mg) => sum + mg.TotalAttempts, 0);

            setStats({
                totalExams: examsRes.count || examsRes.data?.length || 0,
                totalComments: commentsRes.pagination?.total || commentsRes.data?.length || 0,
                totalMediaGroups: mediaGroupsRes.data?.length || 0,
                totalQuestions,
                totalAttempts,
                totalExamTypes: examTypesRes.data?.length || 0
            });

            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    // Process data for charts
    const getExamTypeDistribution = () => {
        const distribution = {};
        exams.forEach(exam => {
            const type = exam.examType?.Code || exam.Type;
            distribution[type] = (distribution[type] || 0) + 1;
        });

        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
        return Object.entries(distribution).map(([name, value], index) => ({
            name,
            value,
            color: colors[index % colors.length]
        }));
    };

    const getDifficultyDistribution = () => {
        const distribution = { EASY: 0, MEDIUM: 0, HARD: 0 };
        mediaGroups.forEach(mg => {
            if (distribution.hasOwnProperty(mg.Difficulty)) {
                distribution[mg.Difficulty]++;
            }
        });

        return [
            { name: 'Easy', value: distribution.EASY, color: '#10b981' },
            { name: 'Medium', value: distribution.MEDIUM, color: '#f59e0b' },
            { name: 'Hard', value: distribution.HARD, color: '#ef4444' }
        ];
    };

    const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        trend > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                        {trend > 0 && <ArrowUp size={12} />}
                        {trend > 0 ? `+${trend}` : 'New'}
                    </div>
                )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={fetchAllData}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
                    >
                        <RefreshCw size={20} />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const examTypeData = getExamTypeDistribution();
    const difficultyData = getDifficultyDistribution();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                                TOEIC Dashboard
                            </h1>
                            {/* <p className="text-gray-600 mt-1">Real-time statistics and analytics</p> */}
                        </div>
                        <button 
                            onClick={fetchAllData}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={BookOpen}
                        title="Total Exams"
                        value={stats.totalExams}
                        color="from-blue-500 to-blue-600"
                        subtitle={`${stats.totalExamTypes} exam types`}
                    />
                    <StatCard
                        icon={FileText}
                        title="Question Groups"
                        value={stats.totalMediaGroups}
                        color="from-green-500 to-green-600"
                        subtitle="Total media groups"
                    />
                    <StatCard
                        icon={Target}
                        title="Total Questions"
                        value={stats.totalQuestions}
                        color="from-purple-500 to-purple-600"
                        subtitle="All questions"
                    />
                    <StatCard
                        icon={MessageSquare}
                        title="Comments"
                        value={stats.totalComments}
                        color="from-orange-500 to-orange-600"
                        subtitle="User discussions"
                    />
                </div>

                {/* Charts - Exam Types and Difficulty */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Số lượng đề mỗi loại đề thi */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Số lượng đề mỗi loại đề thi
                        </h3>
                        {examTypeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={examTypeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                        {examTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[350px] flex items-center justify-center text-gray-400">
                                No exam data available
                            </div>
                        )}
                    </div>

                    {/* Số lượng câu hỏi mỗi độ khó */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-orange-600" />
                            Số lượng câu hỏi mỗi độ khó
                        </h3>
                        {difficultyData.some(d => d.value > 0) ? (
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={difficultyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                        {difficultyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[350px] flex items-center justify-center text-gray-400">
                                No difficulty data available
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}