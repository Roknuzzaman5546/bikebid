import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Users({ users }) {
    const { post } = useForm();

    const toggleStatus = (user) => {
        if (user.status === 'active') {
            post(route('admin.users.suspend', user.id));
        } else {
            post(route('admin.users.unsuspend', user.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-3xl font-black gradient-text">User Management</h2>
                    <p className="text-slate-500 mt-1">Suspend or unsuspend users and manage roles.</p>
                </div>
            }
        >
            <Head title="Admin - Users" />

            <div className="py-12">
                <div className="glass-card rounded-[2rem] overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-white/5">
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">User</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Email</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-indigo-400">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-slate-200">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-slate-400">{user.email}</td>
                                    <td className="px-8 py-5">
                                        <span className={`badge ${user.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`badge ${user.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-pink-500/20 text-pink-400'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <button
                                            onClick={() => toggleStatus(user)}
                                            className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition ${user.status === 'active'
                                                    ? 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20'
                                                    : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                                                }`}
                                        >
                                            {user.status === 'active' ? 'Suspend' : 'Unsuspend'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
