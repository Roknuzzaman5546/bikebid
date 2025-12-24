import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";

export default function Dashboard({ myAuctions = [] }) {
    const { auth } = usePage().props;

    const stats = [
        { label: 'Active Auctions', value: myAuctions.filter(a => a.state === 'live').length, icon: '⚡' },
        { label: 'Pending Start', value: myAuctions.filter(a => a.state === 'scheduled').length, icon: '⏳' },
        { label: 'Completed', value: myAuctions.filter(a => a.state === 'ended').length, icon: '✅' },
        { label: 'Total Value', value: '৳' + myAuctions.reduce((acc, a) => acc + parseFloat(a.current_price || a.starting_price), 0).toLocaleString(), icon: '💰' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black gradient-text">Seller Dashboard</h2>
                        <p className="text-slate-500 mt-1">Manage your listings and track your performance.</p>
                    </div>
                    <Link href="/auctions/create" className="btn-primary mb-1">
                        + List New Bike
                    </Link>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 space-y-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="glass-card p-6 border border-white/5 hover:border-indigo-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-2xl group-hover:scale-110 transition-transform">{stat.icon}</span>
                                <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">Live Data</span>
                            </div>
                            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
                            <p className="text-2xl font-black text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Auctions Section */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-200">My Listings</h3>
                        <div className="flex gap-2">
                            {['all', 'live', 'ended'].map(filter => (
                                <button key={filter} className="px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 text-xs font-bold text-slate-500 hover:text-white transition-colors capitalize">
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {myAuctions.length === 0 ? (
                        <div className="glass-card rounded-[2rem] py-20 text-center border-dashed border-2 border-white/5">
                            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                                🚲
                            </div>
                            <h3 className="text-xl font-bold text-slate-300">No Auctions Yet</h3>
                            <p className="text-slate-500 mt-2 mb-8">Ready to sell your bike? Start by creating your first listing.</p>
                            <Link href="/auctions/create" className="btn-primary">
                                Create My First Auction
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {myAuctions.map((auction) => (
                                <div key={auction.id} className="glass-card overflow-hidden flex flex-col md:flex-row border border-white/5 group">
                                    <div className="w-full md:w-48 bg-slate-900 relative">
                                        <img
                                            src={auction.image_url || `https://api.dicebear.com/9.x/icons/svg?seed=${auction.title}`}
                                            alt={auction.title}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className={`badge text-[10px] ${auction.state === 'live' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    auction.state === 'ended' ? 'bg-slate-800 text-slate-500' :
                                                        'bg-indigo-500/20 text-indigo-400'
                                                }`}>
                                                {auction.state}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-200 truncate mb-1">{auction.title}</h4>
                                            <div className="flex gap-4 mb-4">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Current Price</p>
                                                    <p className="text-indigo-400 font-black">৳{auction.current_price || auction.starting_price}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Ends At</p>
                                                    <p className="text-slate-400 font-mono text-xs">{new Date(auction.end_time).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Link href={route('auctions.show', auction.id)} className="text-xs font-bold text-indigo-400 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors">
                                                Manage Details
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                </svg>
                                            </Link>
                                            {(auction.state === 'live' || auction.state === 'scheduled') && (
                                                <Link
                                                    href={route('auctions.cancel', auction.id)}
                                                    method="post"
                                                    as="button"
                                                    className="text-xs font-bold text-pink-500 hover:text-pink-400 uppercase tracking-widest transition-colors"
                                                >
                                                    Stop Auction
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
