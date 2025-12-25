export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-slate-700 bg-slate-900/50 text-indigo-600 shadow-sm focus:ring-indigo-500 focus:ring-offset-slate-950 ' +
                className
            }
        />
    );
}
