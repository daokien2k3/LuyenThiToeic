export default function Input({ className = "", ...props }) {
    return (
        <input
            className={
                "w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 " +
                className
            }
            {...props}
        />
    );
}
