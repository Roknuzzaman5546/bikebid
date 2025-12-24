export default function Auctions({ auctions }) {
    return (
        <div>
            <h1 className="text-xl font-bold">Auctions</h1>
            {auctions.map(a => (
                <div key={a.id} className="border p-2">
                    {a.title} - {a.status}
                </div>
            ))}
        </div>
    );
}
