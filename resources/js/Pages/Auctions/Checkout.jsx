import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Checkout({ auction }) {
    const { post, processing } = useForm();

    const submit = (e) => {
        e.preventDefault();
        post(route('checkout.process', auction.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Checkout" />

            <div className="py-12 max-w-4xl mx-auto">
                <div className="mb-8 items-center flex gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center font-black text-xl">
                        ✓
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white">Winning Confirmation</h2>
                        <p className="text-slate-500">Secure your win by confirming the purchase details.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="glass-card p-8">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 px-1">Order Summary</h3>
                            <div className="flex gap-6 items-start pb-6 border-b border-white/5">
                                <div className="w-32 h-24 bg-slate-900 rounded-xl overflow-hidden shrink-0">
                                    <img
                                        src={auction.image_url || `https://api.dicebear.com/9.x/icons/svg?seed=${auction.title}`}
                                        alt={auction.title}
                                        className="w-full h-full object-cover opacity-80"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-200 mb-1">{auction.title}</h4>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <span>Seller: {auction.seller?.name}</span>
                                        <span>•</span>
                                        <span>ID: #BID-{auction.id}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 space-y-4">
                                <div className="flex justify-between text-slate-400">
                                    <span>Hammer Price</span>
                                    <span className="font-bold text-slate-200">৳{auction.current_price}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Auction Fee (0%)</span>
                                    <span className="font-bold text-slate-200">৳0.00</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                    <span className="text-lg font-bold text-white">Total Amount</span>
                                    <span className="text-3xl font-black text-indigo-400">৳{auction.current_price}</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 px-1">Payment Method</h3>
                            <div className="p-4 bg-slate-950/50 border border-indigo-500/30 rounded-2xl flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
                                    💵
                                </div>
                                <div>
                                    <p className="font-bold text-slate-200">Cash on Collection</p>
                                    <p className="text-xs text-slate-500">Pay directly to the seller when you pick up the bike.</p>
                                </div>
                                <div className="ml-auto">
                                    <div className="w-5 h-5 rounded-full border-4 border-indigo-500 bg-slate-950"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass-card p-6 bg-indigo-500/5 border-indigo-500/20">
                            <p className="text-xs text-slate-400 leading-relaxed mb-6 italic">
                                By clicking confirm, you agree to complete the purchase and coordinate with the seller for the handover.
                            </p>
                            <form onSubmit={submit}>
                                <button
                                    disabled={processing}
                                    className="w-full btn-primary py-4 text-sm"
                                >
                                    {processing ? 'Processing...' : 'Confirm Purchase'}
                                </button>
                            </form>
                            <button className="w-full mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-white transition">
                                Contact Seller First
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
