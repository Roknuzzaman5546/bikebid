import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        condition: 'Used',
        location: '',
        starting_price: '',
        min_increment: '',
        start_time: '',
        end_time: '',
        reserve_price: '',
        buy_now_price: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('auctions.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Auction</h2>}
        >
            <Head title="Create Auction" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="title" value="Title" />
                                    <TextInput
                                        id="title"
                                        className="mt-1 block w-full"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                        isFocused
                                    />
                                    <InputError className="mt-2" message={errors.title} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        required
                                        rows="4"
                                    ></textarea>
                                    <InputError className="mt-2" message={errors.description} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="condition" value="Condition" />
                                        <select
                                            id="condition"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.condition}
                                            onChange={(e) => setData('condition', e.target.value)}
                                            required
                                        >
                                            <option value="New">New</option>
                                            <option value="Used">Used</option>
                                            <option value="Refurbished">Refurbished</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.condition} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="location" value="Location" />
                                        <TextInput
                                            id="location"
                                            className="mt-1 block w-full"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.location} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="starting_price" value="Starting Price (৳)" />
                                        <TextInput
                                            id="starting_price"
                                            type="number"
                                            className="mt-1 block w-full"
                                            value={data.starting_price}
                                            onChange={(e) => setData('starting_price', e.target.value)}
                                            required
                                            min="1"
                                        />
                                        <InputError className="mt-2" message={errors.starting_price} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="min_increment" value="Minimum Increment (৳)" />
                                        <TextInput
                                            id="min_increment"
                                            type="number"
                                            className="mt-1 block w-full"
                                            value={data.min_increment}
                                            onChange={(e) => setData('min_increment', e.target.value)}
                                            required
                                            min="1"
                                        />
                                        <InputError className="mt-2" message={errors.min_increment} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="start_time" value="Start Time" />
                                        <TextInput
                                            id="start_time"
                                            type="datetime-local"
                                            className="mt-1 block w-full"
                                            value={data.start_time}
                                            onChange={(e) => setData('start_time', e.target.value)}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.start_time} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="end_time" value="End Time" />
                                        <TextInput
                                            id="end_time"
                                            type="datetime-local"
                                            className="mt-1 block w-full"
                                            value={data.end_time}
                                            onChange={(e) => setData('end_time', e.target.value)}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.end_time} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="reserve_price" value="Reserve Price (Optional)" />
                                        <TextInput
                                            id="reserve_price"
                                            type="number"
                                            className="mt-1 block w-full"
                                            value={data.reserve_price}
                                            onChange={(e) => setData('reserve_price', e.target.value)}
                                            min="1"
                                        />
                                        <InputError className="mt-2" message={errors.reserve_price} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="buy_now_price" value="Buy Now Price (Optional)" />
                                        <TextInput
                                            id="buy_now_price"
                                            type="number"
                                            className="mt-1 block w-full"
                                            value={data.buy_now_price}
                                            onChange={(e) => setData('buy_now_price', e.target.value)}
                                            min="1"
                                        />
                                        <InputError className="mt-2" message={errors.buy_now_price} />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <PrimaryButton disabled={processing}>
                                        Create Auction
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}