export default function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-[--ui-border-color] rounded-[--card-radius] p-3 shadow-lg">
        <p className="text-[--title-text-color] text-sm font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-[--body-text-color]" style={{ color: entry.color }}>
            {`${entry.dataKey}: $${entry.value?.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
}