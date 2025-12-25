import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-slate-950 pt-6 sm:justify-center sm:pt-0 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 flex flex-col items-center w-full px-4">
                <Link href="/" className="mb-8 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <ApplicationLogo className="h-20 w-20 fill-current text-indigo-500 group-hover:text-indigo-400 transition-all duration-300 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)] relative z-10" />
                    </div>
                </Link>

                <div className="w-full sm:max-w-md mt-6 px-8 py-10 glass-card rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
                    {/* Decorative line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

                    {children}
                </div>
            </div>
        </div>
    );
}
