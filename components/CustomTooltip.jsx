export default function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/50 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs text-slate-600 dark:text-slate-400" style={{ color: entry.color }}>
            {`${entry.dataKey}: $${entry.value?.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
}