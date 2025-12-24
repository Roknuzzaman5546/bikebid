import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [globalNotification, setGlobalNotification] = useState(null);

    useEffect(() => {
        if (!user) return;

        // Listen for status changes (e.g. auction starts)
        window.Echo.channel('auctions')
            .listen('.AuctionStarted', (e) => {
                setGlobalNotification({
                    title: 'Auction Live!',
                    message: `${e.auction.title} is now open for bidding.`,
                    url: route('auctions.show', e.auction.id)
                });
                setTimeout(() => setGlobalNotification(null), 5000);
            });

        // Listen for personal notifications
        window.Echo.private(`App.Models.User.${user.id}`)
            .notification((notification) => {
                setGlobalNotification({
                    title: notification.title || 'Notification',
                    message: notification.message,
                    url: notification.url
                });
                setTimeout(() => setGlobalNotification(null), 5000);
            });

        return () => {
            window.Echo.leave('auctions');
            window.Echo.leave(`App.Models.User.${user.id}`);
        };
    }, [user.id]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
            <nav className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center gap-2 group">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                                        <ApplicationLogo className="h-6 w-auto fill-current text-white" />
                                    </div>
                                    <span className="text-xl font-black tracking-tight gradient-text">BikeBid</span>
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('home')}
                                    active={route().current('home')}
                                    className="text-sm font-medium transition-colors hover:text-indigo-400"
                                >
                                    Auctions
                                </NavLink>
                                <NavLink
                                    href={route('auctions.create')}
                                    active={route().current('auctions.create')}
                                    className="text-sm font-medium transition-colors hover:text-indigo-400"
                                >
                                    Sell Bike
                                </NavLink>
                                {user.role === 'admin' && (
                                    <NavLink
                                        href={route('admin.users.index')}
                                        active={route().current('admin.users.*')}
                                        className="text-sm font-medium transition-colors hover:text-indigo-400"
                                    >
                                        Admin
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center gap-4">
                            <button className="relative p-2 text-slate-400 hover:text-white transition-colors group">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 3v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                </svg>
                                {user.notifications_count > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-pink-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-950">
                                        {user.notifications_count}
                                    </span>
                                )}
                            </button>

                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 border border-white/5"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-[10px] text-indigo-400">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            {user.name}
                                            <svg className="h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content align="right" width="48" contentClasses="py-1 bg-slate-900 border border-white/10 ring-1 ring-black ring-opacity-5">
                                        <div className="px-4 py-2 border-b border-white/5">
                                            <p className="text-xs text-slate-500">Signed in as</p>
                                            <p className="text-sm font-medium text-slate-300 truncate">{user.email}</p>
                                        </div>
                                        <Dropdown.Link href={route('dashboard')}>Dashboard</Dropdown.Link>
                                        <Dropdown.Link href={route('profile.edit')}>Profile Settings</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((p) => !p)}
                                className="inline-flex items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-slate-900 hover:text-white transition"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-slate-950 border-t border-white/5'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('home')} active={route().current('home')}>Dashboard</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('auctions.create')} active={route().current('auctions.create')}>Sell Bike</ResponsiveNavLink>
                    </div>

                    <div className="border-t border-white/5 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-slate-200">{user.name}</div>
                            <div className="text-sm font-medium text-slate-500">{user.email}</div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">Log Out</ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-slate-950/50 pt-8 pb-4">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="pb-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
            {/* Global Real-time Notification Toast */}
            {globalNotification && (
                <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <div className="glass-card p-4 flex items-start gap-4 border-indigo-500/30 bg-indigo-500/10 shadow-2xl backdrop-blur-xl min-w-[320px]">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                            🔔
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm text-white">{globalNotification.title}</h4>
                            <p className="text-xs text-slate-400 mt-1">{globalNotification.message}</p>
                            {globalNotification.url && (
                                <Link href={globalNotification.url} className="mt-2 inline-block text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300">
                                    View Details →
                                </Link>
                            )}
                        </div>
                        <button onClick={() => setGlobalNotification(null)} className="text-slate-500 hover:text-white">
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
