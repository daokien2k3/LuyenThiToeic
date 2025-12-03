export function Card({ children, className = "" }) {
    return (
        <div className={"p-4 bg-white rounded-xl shadow " + className}>
            {children}
        </div>
    );
}
