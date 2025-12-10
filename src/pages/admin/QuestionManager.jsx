import { useEffect, useState } from "react";
import EditMediaQuestionModal from "./EditMediaQuestionModal";
import AddMediaQuestionModal from "./AddMediaQuestionModal";
import { Plus, Edit, Trash2, Search } from "lucide-react";

export default function AdminQuestionManager() {
    const [parts, setParts] = useState([]);
    const [mediaQuestions, setMediaQuestions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [choices, setChoices] = useState([]);

    const [selectedMedia, setSelectedMedia] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20;

    // Search/filter
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPart, setSelectedPart] = useState(""); // "" = tất cả

    useEffect(() => {
        fetch("/data/toeicPractice.json")
            .then(res => res.json())
            .then(data => {
                setParts(data.parts || []);
                setMediaQuestions(data.mediaQuestions || []);
                setQuestions(data.questions || []);
                setChoices(data.choices || []);
            });
    }, []);

    const handleDelete = (mediaId) => {
        if (!confirm("Bạn chắc chắn muốn xóa media và toàn bộ câu hỏi của media này?")) return;

        setMediaQuestions(prev => prev.filter(m => m.ID !== mediaId));
        setQuestions(prev => prev.filter(q => q.MediaQuestionID !== mediaId));
        setChoices(prev =>
            prev.filter(c => {
                const q = questions.find(q => q.ID === c.QuestionID);
                return q && q.MediaQuestionID !== mediaId;
            })
        );
    };

    const getPartTitle = (partId) => {
        const part = parts.find(p => p.id === partId);
        return part ? part.title : "N/A";
    };

    // Lọc theo search term + part
    const filteredMedia = mediaQuestions.filter((media) => {
        const matchesSearch = media.Script.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPart = selectedPart ? media.PartID === parseInt(selectedPart) : true;
        return matchesSearch && matchesPart;
    });

    // Phân trang
    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentItems = filteredMedia.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredMedia.length / rowsPerPage);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                        Quản lý câu hỏi
                    </h1>

                    <button
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
                        onClick={() => setIsAddOpen(true)}
                    >
                        <Plus className="w-5 h-5" />
                        Thêm câu hỏi
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="mb-4 flex flex-col md:flex-row gap-2 items-center">
                    <div className="flex items-center gap-2 w-full md:w-1/2">
                        <Search className="w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo script..."
                            className="p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <select
                        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={selectedPart}
                        onChange={(e) => { setSelectedPart(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="">-- Tất cả Part --</option>
                        {parts.map(part => (
                            <option key={part.id} value={part.id}>{part.title}</option>
                        ))}
                    </select>
                </div>

                {/* TABLE */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden ring-1 ring-gray-200">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                            <tr>
                                <th className="p-4 border-b text-center font-semibold text-gray-700">STT</th>
                                <th className="p-4 border-b font-semibold text-gray-700">Image</th>
                                <th className="p-4 border-b font-semibold text-gray-700">Audio</th>
                                <th className="p-4 border-b font-semibold text-gray-700">Script</th>
                                <th className="p-4 border-b font-semibold text-gray-700">Part</th>
                                <th className="p-4 border-b font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentItems.map((media, index) => (
                                <tr key={media.ID} className="border-b hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors duration-200">
                                    <td className="p-4 text-center font-semibold text-gray-800">{indexOfFirst + index + 1}</td>
                                    <td className="p-4">
                                        <img src={`/${media.ImageUrl}`} className="w-32 h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200" alt="Media" />
                                    </td>
                                    <td className="p-4">
                                        <audio controls src={`/${media.AudioUrl}`} className="w-48 rounded-lg" />
                                    </td>
                                    <td className="p-4 max-w-xs text-gray-700 truncate" title={media.Script}>{media.Script}</td>
                                    <td className="p-4 text-center font-medium text-gray-800">{getPartTitle(media.PartID)}</td>
                                    <td className="p-4 align-middle text-center">
                                        <div className="flex flex-col md:flex-row items-center justify-center gap-3 h-full">
                                            <button
                                                onClick={() => { setSelectedMedia(media); setIsEditOpen(true); }}
                                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center gap-1"
                                            >
                                                <Edit className="w-4 h-4" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(media.ID)}
                                                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center gap-1"
                                            >
                                                <Trash2 className="w-4 h-4" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-4 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} transition-colors`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                {/* POPUP EDIT */}
                {isEditOpen && (
                    <EditMediaQuestionModal
                        media={selectedMedia}
                        questions={questions.filter(q => q.MediaQuestionID === selectedMedia.ID)}
                        choices={choices}
                        parts={parts}
                        onClose={() => setIsEditOpen(false)}
                    />
                )}

                {/* POPUP ADD */}
                {isAddOpen && (
                    <AddMediaQuestionModal
                        onClose={() => setIsAddOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}




// import { useEffect, useState } from "react";
// import EditMediaQuestionModal from "./EditMediaQuestionModal";
// import AddMediaQuestionModal from "./AddMediaQuestionModal";
// import { Plus, Edit, Trash2 } from "lucide-react";

// export default function AdminQuestionManager() {
//     const [parts, setParts] = useState([]);
//     const [mediaQuestions, setMediaQuestions] = useState([]);
//     const [questions, setQuestions] = useState([]);
//     const [choices, setChoices] = useState([]);

//     const [selectedMedia, setSelectedMedia] = useState(null);
//     const [isEditOpen, setIsEditOpen] = useState(false);
//     const [isAddOpen, setIsAddOpen] = useState(false);
    

//     useEffect(() => {
//         fetch("/data/toeicPractice.json")
//             .then(res => res.json())
//             .then(data => {
//                 setParts(data.parts || []);
//                 setMediaQuestions(data.mediaQuestions || []);
//                 setQuestions(data.questions || []);
//                 setChoices(data.choices || []);
//             });
//     }, []);

//     const handleDelete = (mediaId) => {
//         if (!confirm("Bạn chắc chắn muốn xóa media và toàn bộ câu hỏi của media này?")) return;

//         setMediaQuestions(prev => prev.filter(m => m.ID !== mediaId));
//         setQuestions(prev => prev.filter(q => q.MediaQuestionID !== mediaId));
//         setChoices(prev =>
//             prev.filter(c => {
//                 const q = questions.find(q => q.ID === c.QuestionID);
//                 return q && q.MediaQuestionID !== mediaId;
//             })
//         );
//     };

//     const getPartTitle = (partId) => {
//         const part = parts.find(p => p.id === partId);
//         return part ? part.title : "N/A";
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-8">
//             <div className="max-w-7xl mx-auto">
//                 <div className="flex justify-between items-center mb-8">
//                     <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
//                         Quản lý câu hỏi
//                     </h1>

//                     <button
//                         className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
//                         onClick={() => setIsAddOpen(true)}
//                     >
//                         <Plus className="w-5 h-5" />
//                         Thêm Media Question
//                     </button>
//                 </div>

//                 {/* TABLE */}
//                 <div className="bg-white shadow-xl rounded-2xl overflow-hidden ring-1 ring-gray-200">
//                     <table className="w-full">
//                         <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
//                             <tr>
//                                 <th className="p-4 border-b text-center font-semibold text-gray-700">STT</th>
//                                 <th className="p-4 border-b font-semibold text-gray-700">Image</th>
//                                 <th className="p-4 border-b font-semibold text-gray-700">Audio</th>
//                                 <th className="p-4 border-b font-semibold text-gray-700">Script</th>
//                                 <th className="p-4 border-b font-semibold text-gray-700">Part</th>
//                                 <th className="p-4 border-b font-semibold text-gray-700">Actions</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {mediaQuestions.map((media, index) => (
//                                 <tr key={media.ID} className="border-b hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors duration-200">
//                                     {/* STT */}
//                                     <td className="p-4 text-center font-semibold text-gray-800">
//                                         {index + 1}
//                                     </td>

//                                     {/* Image */}
//                                     {/* Image */}
//                                     <td className="p-4">
//                                         <img
//                                             src={`/${media.ImageUrl}`} // thêm / ở đầu để lấy từ public
//                                             className="w-32 h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
//                                             alt="Media"
//                                         />
//                                     </td>

//                                     {/* Audio */}
//                                     <td className="p-4">
//                                         <audio controls src={`/${media.AudioUrl}`} className="w-48 rounded-lg" />
//                                     </td>



//                                     {/* Script */}
//                                     <td className="p-4 max-w-xs text-gray-700 truncate" title={media.Script}>
//                                         {media.Script}
//                                     </td>

//                                     {/* Part */}
//                                     <td className="p-4 text-center font-medium text-gray-800">
//                                         {getPartTitle(media.PartID)}
//                                     </td>


//                                     {/* Actions */}
//                                     <td className="p-4 align-middle text-center">
//                                         <div className="flex flex-col md:flex-row items-center justify-center gap-3 h-full">
//                                             <button
//                                                 onClick={() => {
//                                                     setSelectedMedia(media);
//                                                     setIsEditOpen(true);
//                                                 }}
//                                                 className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center gap-1"
//                                             >
//                                                 <Edit className="w-4 h-4" />
//                                                 Edit
//                                             </button>

//                                             <button
//                                                 onClick={() => handleDelete(media.ID)}
//                                                 className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center gap-1"
//                                             >
//                                                 <Trash2 className="w-4 h-4" />
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </td>


//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* POPUP EDIT */}
//                 {isEditOpen && (
//                     <EditMediaQuestionModal
//                         media={selectedMedia}
//                         questions={questions.filter(q => q.MediaQuestionID === selectedMedia.ID)}
//                         choices={choices}
//                         parts={parts}
//                         onClose={() => setIsEditOpen(false)}
//                     />
//                 )}

//                 {/* POPUP ADD */}
//                 {isAddOpen && (
//                     <AddMediaQuestionModal
//                         onClose={() => setIsAddOpen(false)}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// }