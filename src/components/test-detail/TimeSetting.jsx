export default function TimeSetting({ customTime, setCustomTime, maxTime, standardTime }) {
    return (
        <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
            <h2 className="text-xl font-bold mb-6">Cài đặt thời gian làm bài</h2>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <label className="block mb-3 font-semibold text-gray-700">
                    Thời gian làm bài (phút):
                </label>

                <div className="flex items-center gap-4">
                    <input
                        type="number"
                        min="5"
                        max={maxTime}
                        value={customTime || standardTime}
                        onChange={(e) => setCustomTime(Number(e.target.value))}
                        className="border-2 border-gray-300 rounded-lg p-3 w-32 text-center font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    
                    {/* <div className="flex gap-2">
                        <button
                            onClick={() => setCustomTime(standardTime)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            Tiêu chuẩn ({standardTime}p)
                        </button>
                        <button
                            onClick={() => setCustomTime(maxTime)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                            Tối đa ({maxTime}p)
                        </button>
                    </div> */}
                </div>

                <div className="mt-4 space-y-1">
                    {/* <p className="text-sm text-gray-600">
                        ⏱️ Thời gian tiêu chuẩn: <span className="font-semibold text-blue-600">{standardTime} phút</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        ⏰ Thời gian tối đa: <span className="font-semibold text-indigo-600">{maxTime} phút</span> (gấp đôi thời gian tiêu chuẩn)
                    </p> */}
                    <p className="text-sm text-gray-500 mt-2">
                        Bạn có thể điều chỉnh thời gian từ 5 phút đến {maxTime} phút
                    </p>
                </div>
            </div>
        </div>
    );
}