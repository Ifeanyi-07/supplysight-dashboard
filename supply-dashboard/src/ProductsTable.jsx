// import React, { useMemo, useState } from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
//   flexRender,
// } from "@tanstack/react-table";

// // Reusable text input filter
// function TextFilter({ column }) {
//   const value = column.getFilterValue() ?? "";
//   return (
//     <input
//       type="text"
//       value={value}
//       onChange={(e) => column.setFilterValue(e.target.value)}
//       placeholder={`Filter ${column.id}...`}
//       className="mt-1 px-2 py-1 border rounded w-full text-xs"
//     />
//   );
// }

// // Dropdown filter for discrete options
// function SelectFilter({ column, options = [] }) {
//   const value = column.getFilterValue() ?? "";
//   return (
//     <select
//       value={value}
//       onChange={(e) => column.setFilterValue(e.target.value || undefined)}
//       className="mt-1 px-2 py-1 border rounded w-full text-xs"
//     >
//       <option value="">All</option>
//       {options.map((opt) => (
//         <option key={opt} value={opt}>
//           {opt}
//         </option>
//       ))}
//     </select>
//   );
// }

// export default function ProductsTable({ products = [], onRowClick }) {
//   const [sorting, setSorting] = useState([]);

//   // Unique warehouse + status values for dropdowns
//   const warehouses = useMemo(
//     () => [...new Set(products.map((p) => p.warehouse || "Unassigned"))].filter(Boolean),
//     [products]
//   );
//   const statuses = useMemo(() => ["Healthy", "Low", "Critical"], []);

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "name",
//         header: () => "Name",
//         cell: (info) => info.getValue() ?? "—",
//       },
//       {
//         accessorKey: "sku",
//         header: () => "SKU",
//         cell: (info) => info.getValue() ?? "—",
//       },
//       {
//         accessorKey: "warehouse",
//         header: () => "Warehouse",
//         cell: (info) => info.getValue() ?? "Unassigned",
//         meta: { filterType: "select", options: warehouses },
//       },
//       {
//         accessorKey: "stock",
//         header: () => "Stock",
//         cell: (info) => (info.getValue() != null ? String(info.getValue()) : "0"),
//       },
//       {
//         accessorKey: "demand",
//         header: () => "Demand",
//         cell: (info) => (info.getValue() != null ? String(info.getValue()) : "0"),
//       },
//       {
//         id: "status",
//         header: () => "Status",
//         accessorFn: (row) => {
//           const stock = Number(row.stock || 0);
//           const demand = Number(row.demand || 0);
//           if (stock > demand) return "Healthy";
//           if (stock === demand) return "Low";
//           return "Critical";
//         },
//         cell: (info) => {
//           const value = info.getValue();
//           let pillClass = "";
//           if (value === "Healthy") pillClass = "bg-green-100 text-green-800";
//           else if (value === "Low") pillClass = "bg-yellow-100 text-yellow-800";
//           else pillClass = "bg-red-100 text-red-800";

//           return (
//             <span className={`px-2 py-1 rounded-full text-xs font-semibold ${pillClass}`}>
//               {value}
//             </span>
//           );
//         },
//         meta: { filterType: "select", options: statuses },
//       },
//     ],
//     [warehouses, statuses]
//   );

//   const table = useReactTable({
//     data: products,
//     columns,
//     state: { sorting },
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//   });

//   const colCount = columns.length;

//   return (
//     <div className="mt-6 bg-white border rounded-xl shadow-sm p-4 w-full overflow-x-auto">
//       <h3 className="text-lg font-semibold mb-4">Products Table</h3>

//       <div className="min-w-[700px]">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   const meta = header.column.columnDef.meta;
//                   return (
//                     <th
//                       key={header.id}
//                       onClick={header.column.getToggleSortingHandler()}
//                       className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer select-none align-top"
//                     >
//                       {flexRender(header.column.columnDef.header, header.getContext())}
//                       {header.column.getIsSorted() === "asc"
//                         ? " 🔼"
//                         : header.column.getIsSorted() === "desc"
//                         ? " 🔽"
//                         : null}

//                       <div className="mt-2">
//                         {meta?.filterType === "select" ? (
//                           <SelectFilter column={header.column} options={meta.options || []} />
//                         ) : header.column.getCanFilter() ? (
//                           <TextFilter column={header.column} />
//                         ) : null}
//                       </div>
//                     </th>
//                   );
//                 })}
//               </tr>
//             ))}
//           </thead>

//           <tbody className="divide-y divide-gray-200">
//             {table.getRowModel().rows.length > 0 ? (
//               table.getRowModel().rows.map((row) => {
//                 const isCritical = Number(row.original.stock || 0) < Number(row.original.demand || 0);
//                 return (
//                   <tr
//                     key={row.id}
//                     className={`${isCritical ? "bg-red-50" : "hover:bg-gray-50"} cursor-pointer`}
//                     onClick={() => onRowClick && onRowClick(row.original)}
//                   >
//                     {row.getVisibleCells().map((cell) => (
//                       <td key={cell.id} className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm">
//                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                       </td>
//                     ))}
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan={colCount} className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500">
//                   No products found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

// Reusable text input filter
function TextFilter({ column }) {
  const value = column.getFilterValue() ?? "";
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Filter ${column.id}...`}
      className="mt-1 px-2 py-1 border rounded w-full text-xs"
    />
  );
}

// Dropdown filter for discrete options
function SelectFilter({ column, options = [] }) {
  const value = column.getFilterValue() ?? "";
  return (
    <select
      value={value}
      onChange={(e) => column.setFilterValue(e.target.value || undefined)}
      className="mt-1 px-2 py-1 border rounded w-full text-xs"
    >
      <option value="">All</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

export default function ProductsTable({ products = [], onRowClick }) {
  const [sorting, setSorting] = useState([]);

  // Unique warehouse + status values for dropdowns
  const warehouses = useMemo(
    () => [...new Set(products.map((p) => p.warehouse || "Unassigned"))].filter(Boolean),
    [products]
  );
  const statuses = useMemo(() => ["Healthy", "Low", "Critical"], []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: () => "Name",
        cell: (info) => info.getValue() ?? "—",
      },
      {
        accessorKey: "sku",
        header: () => "SKU",
        cell: (info) => info.getValue() ?? "—",
      },
      {
        accessorKey: "warehouse",
        header: () => "Warehouse",
        cell: (info) => info.getValue() ?? "Unassigned",
        meta: { filterType: "select", options: warehouses },
      },
      {
        accessorKey: "stock",
        header: () => "Stock",
        cell: (info) => (info.getValue() != null ? String(info.getValue()) : "0"),
      },
      {
        accessorKey: "demand",
        header: () => "Demand",
        cell: (info) => (info.getValue() != null ? String(info.getValue()) : "0"),
      },
      {
        id: "status",
        header: () => "Status",
        accessorFn: (row) => {
          const stock = Number(row.stock || 0);
          const demand = Number(row.demand || 0);
          if (stock > demand) return "Healthy";
          if (stock === demand) return "Low";
          return "Critical";
        },
        cell: (info) => {
          const value = info.getValue();
          let pillClass = "";
          if (value === "Healthy") pillClass = "bg-green-100 text-green-800";
          else if (value === "Low") pillClass = "bg-yellow-100 text-yellow-800";
          else pillClass = "bg-red-100 text-red-800";

          return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${pillClass}`}>
              {value}
            </span>
          );
        },
        meta: { filterType: "select", options: statuses },
      },
    ],
    [warehouses, statuses]
  );

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const colCount = columns.length;

  return (
    <div className="mt-6 bg-white border rounded-xl shadow-sm p-4 w-full overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Products Table</h3>

      {/* Responsive wrapper */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta;
                  return (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer select-none align-top"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc"
                        ? " 🔼"
                        : header.column.getIsSorted() === "desc"
                        ? " 🔽"
                        : null}

                      <div className="mt-1">
                        {meta?.filterType === "select" ? (
                          <SelectFilter column={header.column} options={meta.options || []} />
                        ) : header.column.getCanFilter() ? (
                          <TextFilter column={header.column} />
                        ) : null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => {
                const isCritical = Number(row.original.stock || 0) < Number(row.original.demand || 0);
                return (
                  <tr
                    key={row.id}
                    className={`${isCritical ? "bg-red-50" : "hover:bg-gray-50"} cursor-pointer`}
                    onClick={() => onRowClick && onRowClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-3 sm:px-4 py-2 whitespace-nowrap text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={colCount} className="px-3 sm:px-4 py-4 text-center text-sm text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
