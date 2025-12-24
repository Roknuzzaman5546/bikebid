export default function AuditLogs({ logs }) {
    return (
        <div>
            <h1 className="text-xl font-bold">Audit Logs</h1>
            {logs.map(log => (
                <div key={log.id}>
                    {log.action} - {log.created_at}
                </div>
            ))}
        </div>
    );
}
