import { useForm } from "@inertiajs/react";
import { v4 as uuid } from "uuid";

export default function BidBox({ auction }) {
    const { data, setData, post, errors } = useForm({
        amount: "",
        key: uuid(),
    });

    function submit(e) {
        e.preventDefault();
        post(`/auctions/${auction.id}/bid`);
    }

    return (
        <form onSubmit={submit} className="mt-6">
            <input
                type="number"
                className="border p-2 w-full"
                placeholder="Your bid"
                onChange={e => setData("amount", e.target.value)}
            />

            {errors.amount && (
                <p className="text-red-600 text-sm">{errors.amount}</p>
            )}

            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
                Place Bid
            </button>
        </form>
    );
}
