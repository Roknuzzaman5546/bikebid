import BidBox from "@/Components/BidBox";
import CountdownTimer from "@/Components/CountdownTimer";
import { usePage } from "@inertiajs/react";

export default function Show() {
    const { auction } = usePage().props;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold">{auction.title}</h1>

            <p className="mt-2">{auction.description}</p>

            <div className="mt-4 flex justify-between">
                <div>
                    <p>Current Price</p>
                    <p className="text-xl font-bold">৳{auction.current_price}</p>
                </div>

                <CountdownTimer endTime={auction.end_time} />
            </div>

            <BidBox auction={auction} />

            {auction.buy_now_price && (
                <form method="post" action={`/auctions/${auction.id}/buy`}>
                    <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
                        Buy Now ৳{auction.buy_now_price}
                    </button>
                </form>
            )}
        </div>
    );
}
