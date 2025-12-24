import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";

export default function Index() {
    const { notifications } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-3xl font-black gradient-text">Notifications</h2>
                    <p className="text-slate-500 mt-1">Stay updated with your auction activity.</p>
                </div>
            }
        >
            <Head title="Notifications" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto space-y-4">
                    {notifications && notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div key={notif.id} className={`glass-card rounded-2xl p-6 flex items-start gap-4 border ${notif.read_at ? 'border-white/5 opacity-60' : 'border-indigo-500/30 bg-indigo-500/5'}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${notif.read_at ? 'bg-slate-800 text-slate-500' : 'bg-indigo-500 text-white'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 3v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-bold text-slate-200">{notif.data?.title || 'Auction Update'}</p>
                                        <span className="text-xs text-slate-500">{new Date(notif.created_at).toLocaleString()}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed">{notif.data?.message}</p>
                                    {notif.data?.url && (
                                        <a href={notif.data.url} className="mt-3 inline-block text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">
                                            View Auction →
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="glass-card rounded-[2rem] py-20 text-center">
                            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 3v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-300">No Notifications</h3>
                            <p className="text-slate-500 mt-2">You're all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
