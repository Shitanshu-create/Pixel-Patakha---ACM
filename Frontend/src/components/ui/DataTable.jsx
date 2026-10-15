import './DataTable.css';

export default function DataTable({
  columns = [],
  data = [],
  keyExtractor = (item, idx) => item._id || item.id || idx,
  emptyMessage = 'No records found.',
  className = '',
}) {
  if (!data || data.length === 0) {
    return (
      <div className="data-table-wrapper" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`data-table-wrapper ${className}`}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIdx) => (
            <tr key={keyExtractor(item, rowIdx)}>
              {columns.map((col) => (
                <td key={col.key} data-label={col.label}>
                  {col.render ? col.render(item, rowIdx) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
