import { usePage } from "@inertiajs/react";

export default function Notifications() {
    const { notifications } = usePage().props;

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Notifications</h1>

            {notifications.map(n => (
                <div key={n.id} className="border-b py-2">
                    {n.data.message}
                </div>
            ))}
        </div>
    );
}
