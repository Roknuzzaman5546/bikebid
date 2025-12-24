import { useForm } from "@inertiajs/react";
import { v4 as uuid } from "uuid";

export default function BidBox({ auction }) {
    const { data, setData, post, processing, errors } = useForm({
        amount: "",
        key: uuid(),
    });

    function submit(e) {
        e.preventDefault();
        post(`/auctions/${auction.id}/bid`, {
            onSuccess: () => setData("amount", ""),
        });
    }

    const minBid = (auction.min_increment || 1);

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
                    Your Bid (Min: ৳{minBid})
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">৳</span>
                    <input
                        type="number"
                        className="input-field w-full pl-8"
                        placeholder="0.00"
                        value={data.amount}
                        onChange={e => setData("amount", e.target.value)}
                        min={minBid}
                        step="0.01"
                        required
                    />
                </div>
            </div>

            {errors.amount && (
                <p className="text-pink-500 text-xs font-bold px-1">{errors.amount}</p>
            )}

            <button
                type="submit"
                disabled={processing}
                className="btn-primary w-full py-4 relative group overflow-hidden"
            >
                <span className="relative z-10">Confirm & Place Bid</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <p className="text-[10px] text-slate-500 text-center uppercase tracking-tighter">
                By bidding you agree to our terms of service
            </p>
        </form>
    );
}
