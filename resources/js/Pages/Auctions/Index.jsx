import { Link, usePage } from "@inertiajs/react";

export default function Index() {
    const { auctions } = usePage().props;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Live & Upcoming Auctions</h1>

            <div className="grid md:grid-cols-3 gap-4">
                {auctions.map(a => (
                    <Link
                        key={a.id}
                        href={`/auctions/${a.id}`}
                        className="border rounded p-4 hover:shadow"
                    >
                        <h2 className="font-semibold">{a.title}</h2>
                        <p>Current: ৳{a.current_price}</p>
                        <p className="text-sm text-gray-500">
                            Ends at: {a.end_time}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
