export default function Badge({ children, className = "" }) {
    return (
        <span className={
            "inline-block px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium " +
            className
        }>
            {children}
        </span>
    );
}
