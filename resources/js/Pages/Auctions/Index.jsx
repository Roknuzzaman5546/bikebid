import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ auctions: initialAuctions }) {
    const [auctions, setAuctions] = useState(initialAuctions);

    useEffect(() => {
        const channel = window.Echo.channel('auctions');

        channel
            .listen('.AuctionStarted', (e) => {
                setAuctions(prev => ({
                    ...prev,
                    data: prev.data.map(a => a.id === e.auction.id ? { ...a, state: 'live' } : a)
                }));
            })
            .listen('.BidPlaced', (e) => {
                setAuctions(prev => ({
                    ...prev,
                    data: prev.data.map(a => a.id === e.auctionId ? { ...a, current_price: e.amount } : a)
                }));
            })
            .listen('.AuctionEnded', (e) => {
                setAuctions(prev => ({
                    ...prev,
                    data: prev.data.map(a => a.id === e.auctionId ? { ...a, state: 'ended', current_price: e.finalPrice } : a)
                }));
            });
        return () => window.Echo.leave('auctions');
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Live Auctions" />

            <div className="pt-8 pb-24">
                <div className="relative overflow-hidden glass-card rounded-[3rem] p-12 mb-12 border border-white/5">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent -z-10" />
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                                DISCOVER <span className="gradient-text">LEGENDARY</span> RIDES.
                            </h2>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
                                Join the premier destination for motorcycle enthusiasts in Bangladesh.
                                Secure your next machine through our transparent bidding system.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link href={route('auctions.index', { state: 'live' })} className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold text-sm tracking-widest hover:bg-indigo-600 transition shadow-lg shadow-indigo-500/20">LIVE NOW</Link>
                                <Link href={route('auctions.index', { state: 'scheduled' })} className="px-6 py-3 bg-slate-900 text-slate-300 rounded-xl font-bold text-sm tracking-widest border border-white/10 hover:bg-slate-800 transition">UPCOMING</Link>
                                <Link href={route('auctions.index', { state: 'ended' })} className="px-6 py-3 bg-slate-900 text-slate-300 rounded-xl font-bold text-sm tracking-widest border border-white/10 hover:bg-slate-800 transition">ENDED</Link>
                                <Link href={route('auctions.index', { ending_soon: 1 })} className="px-6 py-3 bg-slate-900 text-slate-300 rounded-xl font-bold text-sm tracking-widest border border-white/10 hover:bg-slate-800 transition">ENDING SOON</Link>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/3">
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search cycles..."
                                    className="w-full bg-slate-950/80 border border-white/10 rounded-2xl pl-12 pr-6 py-4 outline-none focus:border-indigo-500 transition-all font-bold text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {auctions.data.length === 0 ? (
                    <div className="glass-card rounded-3xl p-12 text-center">
                        <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-200">No auctions found</h3>
                        <p className="text-slate-500 mt-2">Be the first to list a bike for auction!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {auctions.data.map((auction) => (
                            <Link
                                key={auction.id}
                                href={route('auctions.show', auction.id)}
                                className="group relative glass-card rounded-3xl p-1 hover:scale-[1.02] transition-all duration-500 overflow-hidden"
                            >
                                <div className="aspect-[4/3] w-full bg-slate-800 overflow-hidden relative group">
                                    <img
                                        src={auction.image_url || `https://api.dicebear.com/9.x/icons/svg?seed=${auction.title}`}
                                        alt={auction.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                                    <div className="absolute top-4 left-4">
                                        <span className={`badge ${auction.state === 'live' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                            auction.state === 'ended' ? 'bg-slate-800 text-slate-400 border border-white/10' :
                                                'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                            }`}>
                                            {auction.state}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10">
                                        <p className="text-xs text-slate-400 font-medium">Starting from</p>
                                        <p className="text-lg font-black text-white">৳{auction.starting_price}</p>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                                        {auction.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                                        {auction.description}
                                    </p>

                                    <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Current Bid</p>
                                            <p className="text-2xl font-black text-indigo-400">৳{auction.current_price || auction.starting_price}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 font-medium lowercase">Ends in</p>
                                            <p className="text-sm font-bold text-slate-300">
                                                {new Date(auction.end_time).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
