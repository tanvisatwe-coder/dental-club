function AuditLog({ logs }) {
  return (
    <div>

      <h2 className="text-cyan-300 font-bold mb-2">Activity Log</h2>

      {logs.length === 0 ? (
        <p className="text-white/50">No activity yet</p>
      ) : (
        logs.map((l, i) => (
          <p key={i} className="text-white/70 text-sm">
            Tooth {l.toothId} → {l.status} at {l.time}
          </p>
        ))
      )}

    </div>
  );
}

export default AuditLog;