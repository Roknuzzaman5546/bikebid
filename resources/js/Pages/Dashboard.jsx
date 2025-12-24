import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";

export default function Dashboard({ myAuctions = [] }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-6">
                    Welcome, {auth.user.name}
                </h1>

                {/* Quick actions */}
                <div className="flex gap-4 mb-8">
                    <Link
                        href="/auctions/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Create Auction
                    </Link>

                    <Link
                        href="/notifications"
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        Notifications
                    </Link>
                </div>

                {/* Seller auctions */}
                <h2 className="text-xl font-semibold mb-4">
                    My Auctions
                </h2>

                {myAuctions.length === 0 && (
                    <p className="text-gray-500">
                        You have not created any auctions yet.
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myAuctions.map((auction) => (
                        <div
                            key={auction.id}
                            className="border rounded p-4 bg-white"
                        >
                            <h3 className="font-bold text-lg">
                                {auction.title}
                            </h3>

                            <p className="text-sm text-gray-500 mb-2">
                                Status:{" "}
                                <span className="capitalize">
                                    {auction.state}
                                </span>
                            </p>

                            <p className="text-sm">
                                Current Price: ৳
                                {auction.current_price ??
                                    auction.starting_price}
                            </p>

                            <div className="mt-3 flex gap-3">
                                <Link
                                    href={`/auctions/${auction.id}`}
                                    className="text-blue-600 underline"
                                >
                                    View
                                </Link>

                                {(auction.state === "scheduled" ||
                                    auction.state === "live") && (
                                        <Link
                                            href={`/auctions/${auction.id}/cancel`}
                                            method="post"
                                            as="button"
                                            className="text-red-600"
                                        >
                                            Cancel
                                        </Link>
                                    )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
