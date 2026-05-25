import { ReactNode } from 'react';

interface Column {
  header: string;
  accessorKey: string;
  cell?: (item: any) => ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  keyExtractor: (item: any) => string;
}

export function Table({ columns, data, keyExtractor }: TableProps) {
  return (
    <div className="w-full overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-100">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            {columns.map((col, i) => (
              <th key={i} className="py-3 px-4 text-sm font-semibold text-slate-600 whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-slate-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={keyExtractor(item)} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors last:border-0">
                {columns.map((col, i) => (
                  <td key={i} className="py-3 px-4 text-sm text-slate-700">
                    {col.cell ? col.cell(item) : item[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
