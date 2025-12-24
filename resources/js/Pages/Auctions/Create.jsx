import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        condition: "used",
        location: "",
        image_url: "",
        start_time: "",
        end_time: "",
        starting_price: "",
        min_increment: "100",
        reserve_price: "",
        buy_now_price: "",
    });

    function submit(e) {
        e.preventDefault();
        post(route('auctions.store'));
    }

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-3xl font-black gradient-text">Create New Auction</h2>
                    <p className="text-slate-500 mt-1">Fill in the details to list your bike for auction.</p>
                </div>
            }
        >
            <Head title="List Your Bike" />

            <div className="py-12">
                <form onSubmit={submit} className="max-w-4xl mx-auto space-y-8">
                    {/* Bike Information */}
                    <div className="glass-card rounded-[2rem] p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                            <h3 className="text-xl font-bold text-slate-100">Bike Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 ml-1">Title</label>
                                <input
                                    type="text"
                                    className="input-field w-full"
                                    placeholder="e.g. Yamaha R15 V3 2021"
                                    value={data.title}
                                    onChange={e => setData("title", e.target.value)}
                                    required
                                />
                                {errors.title && <p className="text-pink-500 text-xs mt-1">{errors.title}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 ml-1">Description</label>
                                <textarea
                                    className="input-field w-full h-32 resize-none"
                                    placeholder="Describe your bike's condition, modifications, etc."
                                    value={data.description}
                                    onChange={e => setData("description", e.target.value)}
                                    required
                                />
                                {errors.description && <p className="text-pink-500 text-xs mt-1">{errors.description}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 ml-1">Condition</label>
                                <select
                                    className="input-field w-full appearance-none"
                                    value={data.condition}
                                    onChange={e => setData("condition", e.target.value)}
                                >
                                    <option value="brand_new">Brand New</option>
                                    <option value="used">Used</option>
                                    <option value="reconditioned">Reconditioned</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 ml-1">Location</label>
                                <input
                                    type="text"
                                    className="input-field w-full"
                                    placeholder="e.g. Dhaka, Bangladesh"
                                    value={data.location}
                                    onChange={e => setData("location", e.target.value)}
                                    required
                                />
                                {errors.location && <p className="text-pink-500 text-xs mt-1">{errors.location}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 ml-1">Image URL</label>
                                <input
                                    type="text"
                                    className="input-field w-full"
                                    placeholder="https://..."
                                    value={data.image_url}
                                    onChange={e => setData("image_url", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Auction Settings */}
                    <div className="glass-card rounded-[2rem] p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                            <h3 className="text-xl font-bold text-slate-100">Auction Settings</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 ml-1">Start Time</label>
                                <input
                                    type="datetime-local"
                                    className="input-field w-full"
                                    value={data.start_time}
                                    onChange={e => setData("start_time", e.target.value)}
                                    required
                                />
                                {errors.start_time && <p className="text-pink-500 text-xs mt-1">{errors.start_time}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 ml-1">End Time</label>
                                <input
                                    type="datetime-local"
                                    className="input-field w-full"
                                    value={data.end_time}
                                    onChange={e => setData("end_time", e.target.value)}
                                    required
                                />
                                {errors.end_time && <p className="text-pink-500 text-xs mt-1">{errors.end_time}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 ml-1">Starting Price (৳)</label>
                                <input
                                    type="number"
                                    className="input-field w-full"
                                    value={data.starting_price}
                                    onChange={e => setData("starting_price", e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 ml-1">Min Increment (৳)</label>
                                <input
                                    type="number"
                                    className="input-field w-full"
                                    value={data.min_increment}
                                    onChange={e => setData("min_increment", e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 ml-1">Reserve Price (৳) - Optional</label>
                                <input
                                    type="number"
                                    className="input-field w-full"
                                    value={data.reserve_price}
                                    onChange={e => setData("reserve_price", e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2 ml-1">Buy Now Price (৳) - Optional</label>
                                <input
                                    type="number"
                                    className="input-field w-full"
                                    value={data.buy_now_price}
                                    onChange={e => setData("buy_now_price", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button type="button" className="btn-secondary">Cancel</button>
                        <button type="submit" disabled={processing} className="btn-primary">
                            {processing ? "Creating..." : "Create Auction"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}