import BidBox from "@/Components/BidBox";
import CountdownTimer from "@/Components/CountdownTimer";
import { usePage, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Show() {
    const { auction: initialAuction, auth } = usePage().props;
    const [auction, setAuction] = useState(initialAuction);
    const [lastPrice, setLastPrice] = useState(initialAuction.current_price);
    const [showNotification, setShowNotification] = useState(false);

    const { post } = useForm();

    useEffect(() => {
        const interval = setInterval(() => {
            axios.get(`/auctions/${auction.id}/updates`)
                .then(response => {
                    const data = response.data;

                    // If price changed
                    if (data.current_price > lastPrice) {
                        setLastPrice(data.current_price);
                        setShowNotification(true);
                        setTimeout(() => setShowNotification(false), 3000);
                    }

                    setAuction(prev => ({
                        ...prev,
                        current_price: data.current_price,
                        end_time: data.end_time,
                        state: data.state,
                        winner_id: data.winner_id,
                        buy_now_price: data.buy_now_price
                    }));
                })
                .catch(console.error);
        }, 2000); // Poll every 2 seconds

        return () => clearInterval(interval);
    }, [auction.id, lastPrice]);

    function buyNow(e) {
        e.preventDefault();
        post(`/auctions/${auction.id}/buy-now`);
    }

    const isWinner = auction.state === 'ended' && auction.winner_id === auth.user?.id;
    const canBuy = (auction.state === 'live' && auction.buy_now_price) || isWinner;

    return (
        <div className="p-6 max-w-3xl mx-auto relative">
            {showNotification && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-bounce z-50">
                    New Bid Placed! Price Updated.
                </div>
            )}

            <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold">{auction.title}</h1>
                <span className={`px-3 py-1 rounded text-sm font-bold uppercase ${auction.state === 'live' ? 'bg-green-100 text-green-800' :
                        auction.state === 'ended' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {auction.state}
                </span>
            </div>

            <p className="mt-2">{auction.description}</p>

            <div className="mt-4 flex justify-between items-center">
                <div>
                    <p>Current Price</p>
                    <p className={`text-xl font-bold transition-colors duration-500 ${showNotification ? 'text-green-600' : ''}`}>
                        ৳{auction.current_price}
                    </p>
                </div>

                <CountdownTimer endTime={auction.end_time} />
            </div>

            {auction.state === 'live' ? (
                <BidBox auction={auction} />
            ) : (
                <div className="mt-6 p-4 bg-gray-100 rounded text-center text-gray-500 font-medium">
                    {auction.state === 'ended' ? 'Auction Ended' : 'Auction Not Started'}
                </div>
            )}

            {canBuy && (
                <form onSubmit={buyNow}>
                    <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
                        {isWinner ? "Complete Purchase" : `Buy Now ৳${auction.buy_now_price}`}
                    </button>
                </form>
            )}
        </div>
    );
}
