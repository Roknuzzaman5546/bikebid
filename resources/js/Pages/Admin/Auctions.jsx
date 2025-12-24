import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Auctions({ auctions }) {
    const { post, setData, data } = useForm({
        reason: "Policy violation"
    });

    const cancelAuction = (id) => {
        if (confirm('Are you sure you want to cancel this auction?')) {
            post(route('admin.auctions.cancel', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-3xl font-black gradient-text">Auction Oversight</h2>
                    <p className="text-slate-500 mt-1">Monitor all listings and intervene when necessary.</p>
                </div>
            }
        >
            <Head title="Admin - Auctions" />

            <div className="py-12">
                <div className="glass-card rounded-[2rem] overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-white/5">
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Auction</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Seller</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Price</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">State</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {auctions.map((auction) => (
                                <tr key={auction.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-200">{auction.title}</span>
                                            <span className="text-xs text-slate-500">ID: #BID-{auction.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-slate-400 font-medium">{auction.seller?.name}</td>
                                    <td className="px-8 py-5 font-black text-indigo-400">৳{auction.current_price || auction.starting_price}</td>
                                    <td className="px-8 py-5">
                                        <span className={`badge ${auction.state === 'live' ? 'bg-emerald-500/20 text-emerald-400' :
                                                auction.state === 'ended' ? 'bg-slate-800 text-slate-400' :
                                                    'bg-pink-500/20 text-pink-400'
                                            }`}>
                                            {auction.state}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        {auction.state !== 'canceled' && auction.state !== 'ended' && (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    className="bg-slate-900 border border-white/5 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-indigo-500 transition"
                                                    placeholder="Reason..."
                                                    onChange={e => setData('reason', e.target.value)}
                                                />
                                                <button
                                                    onClick={() => cancelAuction(auction.id)}
                                                    className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-pink-500/10 text-pink-500 rounded-lg hover:bg-pink-500/20 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
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
