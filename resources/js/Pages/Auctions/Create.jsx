import { useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, errors } = useForm({
        title: '',
        description: '',
        starting_price: '',
        min_increment: '',
        start_time: '',
        end_time: '',
        reserve_price: '',
        buy_now_price: ''
    });

    const submit = e => {
        e.preventDefault();
        post('/auctions');
    };

    return (
        <form onSubmit={submit} className="max-w-xl">
            <h1 className="text-xl font-bold mb-4">Create Auction</h1>

            <input placeholder="Title" onChange={e => setData('title', e.target.value)} />
            <textarea placeholder="Description" onChange={e => setData('description', e.target.value)} />

            <input type="number" placeholder="Starting Price" onChange={e => setData('starting_price', e.target.value)} />
            <input type="number" placeholder="Min Increment" onChange={e => setData('min_increment', e.target.value)} />

            <input type="datetime-local" onChange={e => setData('start_time', e.target.value)} />
            <input type="datetime-local" onChange={e => setData('end_time', e.target.value)} />

            <input type="number" placeholder="Reserve Price (optional)" onChange={e => setData('reserve_price', e.target.value)} />
            <input type="number" placeholder="Buy Now Price (optional)" onChange={e => setData('buy_now_price', e.target.value)} />

            <button className="bg-blue-600 text-white px-4 py-2 mt-3">
                Create Auction
            </button>
        </form>
    );
}
