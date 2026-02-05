export default function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs text-gray-600 dark:text-gray-400" style={{ color: entry.color }}>
            {`${entry.dataKey}: $${entry.value?.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
}