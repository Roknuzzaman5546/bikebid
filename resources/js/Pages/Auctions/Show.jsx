import BidBox from "@/Components/BidBox";
import CountdownTimer from "@/Components/CountdownTimer";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, useForm, Head } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Show() {
    const { auction: initialAuction, auth } = usePage().props;
    const [auction, setAuction] = useState(initialAuction);
    const [showNotification, setShowNotification] = useState(false);
    const [activeTab, setActiveTab] = useState('details');

    const { post, processing } = useForm();

    useEffect(() => {
        const channel = window.Echo.channel(`auction.${auction.id}`);

        channel
            .listen('.BidPlaced', (e) => {
                setAuction(prev => ({
                    ...prev,
                    current_price: e.amount,
                    bids: [e.bid, ...(prev.bids || [])]
                }));
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            })
            .listen('.AuctionExtended', (e) => {
                setAuction(prev => ({
                    ...prev,
                    end_time: e.newEndTime
                }));
            })
            .listen('.AuctionEnded', (e) => {
                setAuction(prev => ({
                    ...prev,
                    state: 'ended',
                    winner_id: e.winnerId,
                    current_price: e.finalPrice
                }));
            })
            .listen('.AuctionStarted', (e) => {
                setAuction(prev => ({
                    ...prev,
                    state: 'live'
                }));
            });

        return () => {
            window.Echo.leave(`auction.${auction.id}`);
        };
    }, [auction.id]);

    function toggleWatchlist() {
        post(`/watch/${auction.id}`, {
            preserveScroll: true,
        });
    }

    function buyNow(e) {
        e.preventDefault();
        post(`/auctions/${auction.id}/buy-now`);
    }

    const isWinner = auction.state === 'ended' && auction.winner_id === auth.user?.id;
    const canBuy = (auction.state === 'live' && auction.buy_now_price) || isWinner;
    const isWatched = auth.user?.watchlists?.some(w => w.auction_id === auction.id);

    return (
        <AuthenticatedLayout>
            <Head title={auction.title} />

            <div className="py-12 relative">
                {showNotification && (
                    <div className="fixed top-24 right-8 bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-indigo-500/40 animate-bounce z-50 flex items-center gap-3 border border-indigo-400/30 backdrop-blur-md">
                        <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                        <span className="font-bold">New high bid placed!</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Image & Details */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="glass-card rounded-[2rem] overflow-hidden p-2">
                            <div className="aspect-video w-full rounded-[1.5rem] bg-slate-800 relative group overflow-hidden">
                                <img
                                    src={auction.image_url || `https://api.dicebear.com/9.x/icons/svg?seed=${auction.title}`}
                                    alt={auction.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute top-6 left-6 flex gap-2">
                                    <span className={`badge px-4 py-1.5 text-sm ${auction.state === 'live' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800/80 text-slate-400 border border-white/10'}`}>
                                        {auction.state}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card rounded-[2rem] p-8">
                            <div className="flex border-b border-white/5 mb-8">
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`pb-4 px-6 text-sm font-bold transition-all border-b-2 ${activeTab === 'details' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                                >
                                    Bike Specifications
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`pb-4 px-6 text-sm font-bold transition-all border-b-2 ${activeTab === 'history' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                                >
                                    Bid History
                                </button>
                            </div>

                            {activeTab === 'details' ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                                            <p className="text-xs text-slate-500 mb-1">Condition</p>
                                            <p className="font-bold text-slate-200">{auction.condition}</p>
                                        </div>
                                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                                            <p className="text-xs text-slate-500 mb-1">Location</p>
                                            <p className="font-bold text-slate-200 uppercase">{auction.location}</p>
                                        </div>
                                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                                            <p className="text-xs text-slate-500 mb-1">Seller</p>
                                            <p className="font-bold text-indigo-400">{auction.seller?.name}</p>
                                        </div>
                                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                                            <p className="text-xs text-slate-500 mb-1">Auction ID</p>
                                            <p className="font-bold text-slate-200">#BID-{auction.id}</p>
                                        </div>
                                    </div>
                                    <div className="prose prose-invert max-w-none">
                                        <h3 className="text-xl font-bold text-slate-100 mb-4">Description</h3>
                                        <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{auction.description}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {auction.bids?.length ? (
                                        auction.bids.map((bid, i) => (
                                            <div key={bid.id} className={`flex justify-between items-center p-4 rounded-2xl border ${i === 0 ? 'bg-indigo-500/10 border-indigo-500/30 shadow-lg shadow-indigo-500/5' : 'bg-slate-950/50 border-white/5'}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${i === 0 ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                                        {bid.user?.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-200">{bid.user?.name} {i === 0 && <span className="ml-2 text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Highest</span>}</p>
                                                        <p className="text-xs text-slate-500">{new Date(bid.created_at).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <p className={`text-lg font-black ${i === 0 ? 'text-indigo-400' : 'text-slate-300'}`}>৳{bid.amount}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-slate-500">No bids placed yet.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Bidding Card */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-6">
                            <div className="glass-card rounded-[2rem] p-8 relative overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                                <div className="space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Current Price</p>
                                            <p className="text-4xl font-black text-white">৳{auction.current_price}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Bids</p>
                                            <p className="text-xl font-bold text-slate-300">{auction.bids?.length || 0}</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-3 text-slate-400 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                            <span className="text-xs font-bold uppercase tracking-wider">Time Remaining</span>
                                        </div>
                                        <CountdownTimer endTime={auction.end_time} />
                                    </div>

                                    {auction.state === 'live' ? (
                                        <div className="space-y-4">
                                            <BidBox auction={auction} />

                                            {auction.buy_now_price && (
                                                <div className="relative group">
                                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                                                    <form onSubmit={buyNow}>
                                                        <button
                                                            disabled={processing}
                                                            className="relative w-full bg-slate-950 hover:bg-slate-900 text-emerald-400 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 border border-emerald-500/30"
                                                        >
                                                            <span>Buy it Now for ৳{auction.buy_now_price}</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                                                            </svg>
                                                        </button>
                                                    </form>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-slate-900/50 rounded-2xl text-center border border-white/10">
                                            <div className="mb-4">
                                                <p className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-1">
                                                    {auction.state === 'ended' ? 'Auction Ended' : 'Auction Not Live'}
                                                </p>
                                                <p className="text-3xl font-black text-white">
                                                    {auction.state === 'ended' ? `৳${auction.current_price}` : '---'}
                                                </p>
                                                {auction.state === 'ended' && auction.winner_id && (
                                                    <span className="inline-block mt-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/20">
                                                        Sold
                                                    </span>
                                                )}
                                            </div>

                                            {isWinner && (
                                                <div className="mt-4">
                                                    <p className="text-emerald-400 font-bold text-xl mb-4">🏆 You won this auction!</p>
                                                    <Link href={route('checkout.show', auction.id)} className="btn-primary w-full text-center inline-block">Complete Checkout</Link>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="glass-card rounded-[2rem] p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isWatched ? 'bg-pink-500/20 text-pink-500' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill={isWatched ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-bold text-slate-300">
                                        {isWatched ? 'In your Watchlist' : 'Add to Watchlist'}
                                    </span>
                                </div>
                                <button
                                    onClick={toggleWatchlist}
                                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4 uppercase tracking-widest"
                                >
                                    {isWatched ? 'Remove' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
