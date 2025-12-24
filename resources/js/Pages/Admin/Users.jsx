export default function Users({ users }) {
    return (
        <div>
            <h1 className="text-xl font-bold">Users</h1>
            {users.map(u => (
                <div key={u.id} className="border p-2 flex justify-between">
                    <span>{u.name} ({u.status})</span>
                </div>
            ))}
        </div>
    );
}
