import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function AuditLogs({ logs }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-3xl font-black gradient-text">System Audit Trail</h2>
                    <p className="text-slate-500 mt-1">Trace every critical action in the system for complete transparency.</p>
                </div>
            }
        >
            <Head title="Admin - Audit Logs" />

            <div className="py-12">
                <div className="glass-card rounded-[2rem] overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-white/5">
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Time</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Action</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">User ID</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Auction ID</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-4 text-xs text-slate-500 font-mono">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-8 py-4 text-sm font-bold">
                                        <span className={`px-2 py-1 rounded text-[10px] uppercase font-black ${log.action.includes('REJECTED') ? 'bg-pink-500/10 text-pink-500 border border-pink-500/20' :
                                            log.action.includes('ACCEPTED') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                                'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-sm text-slate-400">#{log.user_id || 'SYSTEM'}</td>
                                    <td className="px-8 py-4 text-sm text-slate-400">#{log.auction_id || 'N/A'}</td>
                                    <td className="px-8 py-4 text-xs text-slate-500 italic max-w-xs truncate">
                                        {(() => {
                                            try {
                                                const d = JSON.parse(log.details);
                                                return d.value || log.details;
                                            } catch (e) {
                                                return log.details;
                                            }
                                        })()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
