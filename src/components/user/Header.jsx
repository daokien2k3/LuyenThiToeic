import { Link } from 'react-router-dom';

export default function Header({ testName = "TOEIC Test" }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 truncate">{testName}</h1>
        <Link
          to="/user/tests"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Thoát
        </Link>
      </div>
    </div>
  )
}
