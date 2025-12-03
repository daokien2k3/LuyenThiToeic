export default function Select({ children, className = "", ...props }) {
    return (
        <select
            className={
                "w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 " +
                className
            }
            {...props}
        >
            {children}
        </select>
    );
}
