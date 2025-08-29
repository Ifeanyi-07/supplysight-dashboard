// import React, { useState, useMemo } from "react";
// import { gql, useQuery, useMutation } from "@apollo/client";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import ProductsTable from "./ProductsTable.jsx";

// // Queries
// const GET_PRODUCTS = gql`
//   query Products {
//     products {
//       id
//       name
//       sku
//       stock
//       demand
//       warehouse
//       status
//     }
//   }
// `;

// // Mutations
// const UPDATE_DEMAND = gql`
//   mutation UpdateDemand($id: ID!, $demand: Int!) {
//     updateDemand(id: $id, demand: $demand) {
//       id
//       stock
//       demand
//       status
//     }
//   }
// `;

// const TRANSFER_STOCK = gql`
//   mutation TransferStock($id: ID!, $stock: Int!) {
//     transferStock(id: $id, stock: $stock) {
//       id
//       stock
//       demand
//       status
//     }
//   }
// `;

// function StatCard({ label, value }) {
//   return (
//     <div className="bg-white rounded-xl shadow-sm border p-5">
//       <p className="text-gray-500 text-sm">{label}</p>
//       <p className="mt-2 text-4xl font-semibold text-gray-900">{value}</p>
//     </div>
//   );
// }

// export default function ProductsDashboard() {
//   // -----------------------------
//   // HOOKS
//   // -----------------------------
//   const { data, loading, error } = useQuery(GET_PRODUCTS);
//   const [updateDemand] = useMutation(UPDATE_DEMAND, {
//     refetchQueries: [{ query: GET_PRODUCTS }],
//   });
//   const [transferStock] = useMutation(TRANSFER_STOCK, {
//     refetchQueries: [{ query: GET_PRODUCTS }],
//   });

//   const [selectedRange, setSelectedRange] = useState("7d");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [warehouseFilter, setWarehouseFilter] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [drawerProduct, setDrawerProduct] = useState(null);
//   const [drawerDemandInput, setDrawerDemandInput] = useState("");
//   const [drawerTransferInput, setDrawerTransferInput] = useState("");

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // -----------------------------
//   // SAFE: products and computed values
//   // -----------------------------
//   const products = useMemo(() => data?.products ?? [], [data]);

//   const warehouses = useMemo(
//     () => [...new Set(products.map((p) => p.warehouse || "Unassigned"))].filter(Boolean),
//     [products]
//   );

//   const cutoffDate = useMemo(() => {
//     const days = parseInt(selectedRange, 10) || 0;
//     const d = new Date();
//     d.setHours(0, 0, 0, 0);
//     d.setDate(d.getDate() - days);
//     return d;
//   }, [selectedRange]);

//   const displayedProducts = useMemo(() => {
//     const q = (searchTerm || "").trim().toLowerCase();
//     return products.filter((p) => {
//       const matchesSearch =
//         !q ||
//         (p.name && p.name.toLowerCase().includes(q)) ||
//         (p.sku && p.sku.toLowerCase().includes(q));
//       const matchesWarehouse =
//         !warehouseFilter || (p.warehouse || "Unassigned") === warehouseFilter;
//       return matchesSearch && matchesWarehouse;
//     });
//   }, [products, searchTerm, warehouseFilter]);

//   const paginatedProducts = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return displayedProducts.slice(startIndex, startIndex + itemsPerPage);
//   }, [displayedProducts, currentPage]);

//   const totalStock = useMemo(
//     () => displayedProducts.reduce((sum, p) => sum + (Number(p.stock) || 0), 0),
//     [displayedProducts]
//   );
//   const totalDemand = useMemo(
//     () => displayedProducts.reduce((sum, p) => sum + (Number(p.demand) || 0), 0),
//     [displayedProducts]
//   );
//   const fillRate = totalDemand > 0 ? Math.round((totalStock / totalDemand) * 100) : 0;

//   const chartData = useMemo(
//     () =>
//       displayedProducts.map((p) => ({
//         id: p.id,
//         name: p.name,
//         stock: Number(p.stock) || 0,
//         demand: Number(p.demand) || 0,
//         fillRate: p.demand ? ((Number(p.stock) || 0) / Number(p.demand)) * 100 : 0,
//       })),
//     [displayedProducts]
//   );

//   // -----------------------------
//   // RENDER SAFE EARLY RETURN
//   // -----------------------------
//   if (loading)
//     return (
//       <div className="min-h-screen grid place-items-center text-gray-500">
//         Loading dashboard…
//       </div>
//     );
//   if (error)
//     return (
//       <div className="min-h-screen grid place-items-center text-red-600">
//         Failed to load: {error.message}
//       </div>
//     );

//   // -----------------------------
//   // EVENT HANDLERS
//   // -----------------------------
//   const handleRowClick = (product) => {
//     setDrawerProduct(product);
//     setDrawerDemandInput(product?.demand != null ? String(product.demand) : "");
//     setDrawerTransferInput("");
//     setDrawerOpen(true);
//   };

//   const closeDrawer = () => {
//     setDrawerOpen(false);
//     setDrawerProduct(null);
//   };

//   const handleDrawerUpdateDemand = async () => {
//     if (!drawerProduct) return;
//     try {
//       await updateDemand({
//         variables: { id: drawerProduct.id, demand: parseInt(drawerDemandInput, 10) || 0 },
//       });
//     } catch (err) {
//       console.error("Drawer update demand error:", err);
//       alert("Failed to update demand. Check console.");
//     }
//   };

//   const handleDrawerTransferStock = async () => {
//     if (!drawerProduct) return;
//     try {
//       await transferStock({
//         variables: { id: drawerProduct.id, stock: parseInt(drawerTransferInput, 10) || 0 },
//       });
//       setDrawerTransferInput("");
//     } catch (err) {
//       console.error("Drawer transfer stock error:", err);
//       alert("Failed to transfer stock. Check console.");
//     }
//   };

//   const renderCustomDot = (props) => {
//     const { cx, cy, payload, dataKey, index } = props;
//     if (!payload) return null;
//     if (dataKey === "stock" && Number(payload.stock) < Number(payload.demand)) {
//       return <circle key={`stock-shortage-${payload.id || index}`} cx={cx} cy={cy} r={6} stroke="red" strokeWidth={2} fill="white" />;
//     }
//     if (dataKey === "stock") return <circle key={`stock-${payload.id || index}`} cx={cx} cy={cy} r={5} fill="#3b82f6" />;
//     if (dataKey === "demand") return <circle key={`demand-${payload.id || index}`} cx={cx} cy={cy} r={5} fill="#ef4444" />;
//     return null;
//   };

//   const safeTooltipFormatter = (value, name) => {
//     if (name === "fillRate") {
//       const n = Number(value);
//       return [Number.isFinite(n) ? `${Math.round(n)}%` : "—", "Fill Rate"];
//     }
//     return [value ?? "—", String(name)];
//   };

//   // -----------------------------
//   // RENDER
//   // -----------------------------
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Top bar */}
//       <header className="bg-blue-600 text-white">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <h1 className="text-2xl font-semibold">SupplySight</h1>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-6 py-8">
//         <h2 className="text-3xl font-bold text-gray-900">Daily Inventory Dashboard</h2>

//         {/* KPI cards */}
//         <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <StatCard label="Total Stock" value={totalStock.toLocaleString()} />
//           <StatCard label="Total Demand" value={totalDemand.toLocaleString()} />
//           <StatCard label="Fill Rate" value={`${fillRate}%`} />
//         </div>

//         {/* Two-column layout */}
//         <div className="mt-6 grid grid-cols-[2fr_1fr] gap-6">
//           {/* Left column */}
//           <div>
//             <div className="bg-white shadow-sm p-11 rounded-xl h-[400px]">
//               <h3 className="text-lg font-semibold mb-4">Stock vs Demand</h3>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={chartData}>
//                   <CartesianGrid strokeDasharray="4 4" vertical={false} />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip formatter={safeTooltipFormatter} />
//                   <Legend verticalAlign="top" height={36} />
//                   <Line type="monotone" dataKey="stock" stroke="#3b82f6" strokeWidth={2} dot={renderCustomDot} activeDot={{ r: 8 }} />
//                   <Line type="monotone" dataKey="demand" stroke="#ef4444" dot={renderCustomDot} strokeWidth={2} />
//                   <Line type="monotone" dataKey="fillRate" stroke="#facc15" strokeWidth={2} dot={{ r: 4 }} name="Fill Rate (%)" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Table */}
//             <div className="mt-6">
//               <ProductsTable products={paginatedProducts} onRowClick={handleRowClick} />
//             </div>
//           </div>

//           {/* Right column */}
//           <div className="flex flex-col space-y-6">
//             {/* Date selection */}
//             <div className="bg-white border rounded-xl shadow-sm p-4">
//               <h3 className="text-md font-semibold mb-3">Date Range</h3>
//               <div className="flex gap-2">
//                 {["7d", "14d", "30d"].map((r) => (
//                   <button
//                     key={r}
//                     className={`px-3 py-1 rounded-full border text-sm cursor-pointer ${
//                       selectedRange === r ? "bg-blue-500 text-white border-blue-500" : "bg-gray-100 text-gray-700 border-gray-200"
//                     }`}
//                     onClick={() => setSelectedRange(r)}
//                   >
//                     {r}
//                   </button>
//                 ))}
//               </div>
//               <p className="text-xs text-gray-500 mt-2">Cutoff date: {cutoffDate.toDateString()}</p>
//             </div>

//             {/* Interactions — Filters (live) */}
//             <div className="bg-white border rounded-xl shadow-sm p-4">
//               <h3 className="text-md font-semibold mb-3">Interactions — Filters (live)</h3>
//               <div className="space-y-3">
//                 <input
//                   type="search"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search by name or SKU"
//                   className="w-full border rounded p-2"
//                 />
//                 <select
//                   value={warehouseFilter}
//                   onChange={(e) => setWarehouseFilter(e.target.value)}
//                   className="w-full border rounded p-2"
//                 >
//                   <option value="">All warehouses</option>
//                   {warehouses.map((w) => (
//                     <option key={w} value={w}>
//                       {w}
//                     </option>
//                   ))}
//                 </select>
//                 <p className="text-xs text-gray-500">Filters update the chart and table immediately.</p>
//               </div>
//             </div>

//             {/* Pagination */}
//             <div className="bg-white border rounded-xl shadow-sm p-1 mt-auto">
//               <h3 className="text-md font-semibold mb-2">Pages</h3>
//               <div className="flex flex-wrap gap-2">
//                 {Array.from({ length: 10 }, (_, i) => i + 1).map((page) => {
//                   const startIndex = (page - 1) * itemsPerPage;
//                   const hasProducts = displayedProducts.slice(startIndex, startIndex + itemsPerPage).length > 0;

//                   return (
//                     <button
//                       key={page}
//                       onClick={() => hasProducts && setCurrentPage(page)}
//                       className={`px-3 py-1 rounded border text-sm ${
//                         currentPage === page
//                           ? "bg-blue-500 text-white border-blue-500"
//                           : "bg-gray-100 text-gray-700 border-gray-200"
//                       } ${!hasProducts ? "opacity-50 cursor-not-allowed" : ""}`}
//                     >
//                       {page}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Drawer */}
//       {drawerOpen && (
//         <div className="fixed top-0 right-0 h-full z-50 w-full sm:w-96 bg-white shadow-xl flex flex-col">
//           <div className="p-4 border-b flex items-center justify-between">
//             <div>
//               <h4 className="text-lg font-semibold">{drawerProduct?.name}</h4>
//               <p className="text-sm text-gray-500">{drawerProduct?.sku}</p>
//             </div>
//             <button onClick={closeDrawer} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer">
//               Close
//             </button>
//           </div>

//           <div className="p-4 flex-1 overflow-auto space-y-4">
//             <div className="bg-gray-50 p-3 rounded">
//               <p className="text-sm text-gray-700"><strong>Warehouse:</strong> {drawerProduct?.warehouse || "—"}</p>
//               <p className="text-sm text-gray-700"><strong>Status:</strong> {drawerProduct?.status || "—"}</p>
//               <p className="text-sm text-gray-700"><strong>Stock:</strong> {drawerProduct?.stock ?? "—"}</p>
//               <p className="text-sm text-gray-700"><strong>Demand:</strong> {drawerProduct?.demand ?? "—"}</p>
//             </div>

//             <div>
//               <h5 className="font-medium">Update Demand</h5>
//               <input type="number" value={drawerDemandInput} onChange={(e) => setDrawerDemandInput(e.target.value)} className="border p-2 rounded w-full mt-2" />
//               <div className="mt-2 flex gap-2">
//                 <button onClick={handleDrawerUpdateDemand} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">Save</button>
//                 <button onClick={() => setDrawerDemandInput(drawerProduct?.demand != null ? String(drawerProduct.demand) : "")} className="px-4 py-2 border rounded cursor-pointer">Reset</button>
//               </div>
//             </div>

//             <div>
//               <h5 className="font-medium">Transfer Stock</h5>
//               <input type="number" value={drawerTransferInput} onChange={(e) => setDrawerTransferInput(e.target.value)} className="border p-2 rounded w-full mt-2" />
//               <div className="mt-2 flex gap-2">
//                 <button onClick={handleDrawerTransferStock} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">Transfer</button>
//                 <button onClick={() => setDrawerTransferInput("")} className="px-4 py-2 border rounded cursor-pointer">Reset</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useMemo } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ProductsTable from "./ProductsTable.jsx";

// Queries
const GET_PRODUCTS = gql`
  query Products {
    products {
      id
      name
      sku
      stock
      demand
      warehouse
      status
    }
  }
`;

// Mutations
const UPDATE_DEMAND = gql`
  mutation UpdateDemand($id: ID!, $demand: Int!) {
    updateDemand(id: $id, demand: $demand) {
      id
      stock
      demand
      status
    }
  }
`;

const TRANSFER_STOCK = gql`
  mutation TransferStock($id: ID!, $stock: Int!) {
    transferStock(id: $id, stock: $stock) {
      id
      stock
      demand
      status
    }
  }
`;

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-5">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="mt-2 text-3xl sm:text-4xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default function ProductsDashboard() {
  const { data, loading, error } = useQuery(GET_PRODUCTS);
  const [updateDemand] = useMutation(UPDATE_DEMAND, { refetchQueries: [{ query: GET_PRODUCTS }] });
  const [transferStock] = useMutation(TRANSFER_STOCK, { refetchQueries: [{ query: GET_PRODUCTS }] });

  const [selectedRange, setSelectedRange] = useState("7d");
  const [searchTerm, setSearchTerm] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerProduct, setDrawerProduct] = useState(null);
  const [drawerDemandInput, setDrawerDemandInput] = useState("");
  const [drawerTransferInput, setDrawerTransferInput] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const products = useMemo(() => data?.products ?? [], [data]);
  const warehouses = useMemo(
    () => [...new Set(products.map((p) => p.warehouse || "Unassigned"))].filter(Boolean),
    [products]
  );

  const cutoffDate = useMemo(() => {
    const days = parseInt(selectedRange, 10) || 0;
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - days);
    return d;
  }, [selectedRange]);

  const displayedProducts = useMemo(() => {
    const q = (searchTerm || "").trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !q || (p.name && p.name.toLowerCase().includes(q)) || (p.sku && p.sku.toLowerCase().includes(q));
      const matchesWarehouse = !warehouseFilter || (p.warehouse || "Unassigned") === warehouseFilter;
      return matchesSearch && matchesWarehouse;
    });
  }, [products, searchTerm, warehouseFilter]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return displayedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [displayedProducts, currentPage]);

  const totalStock = useMemo(() => displayedProducts.reduce((sum, p) => sum + (Number(p.stock) || 0), 0), [
    displayedProducts,
  ]);
  const totalDemand = useMemo(() => displayedProducts.reduce((sum, p) => sum + (Number(p.demand) || 0), 0), [
    displayedProducts,
  ]);
  const fillRate = totalDemand > 0 ? Math.round((totalStock / totalDemand) * 100) : 0;

  const chartData = useMemo(
    () =>
      displayedProducts.map((p) => ({
        id: p.id,
        name: p.name,
        stock: Number(p.stock) || 0,
        demand: Number(p.demand) || 0,
        fillRate: p.demand ? ((Number(p.stock) || 0) / Number(p.demand)) * 100 : 0,
      })),
    [displayedProducts]
  );

  if (loading)
    return <div className="min-h-screen grid place-items-center text-gray-500">Loading dashboard…</div>;
  if (error)
    return <div className="min-h-screen grid place-items-center text-red-600">Failed to load: {error.message}</div>;

  const handleRowClick = (product) => {
    setDrawerProduct(product);
    setDrawerDemandInput(product?.demand != null ? String(product.demand) : "");
    setDrawerTransferInput("");
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerProduct(null);
  };

  const handleDrawerUpdateDemand = async () => {
    if (!drawerProduct) return;
    try {
      await updateDemand({ variables: { id: drawerProduct.id, demand: parseInt(drawerDemandInput, 10) || 0 } });
    } catch (err) {
      console.error(err);
      alert("Failed to update demand. Check console.");
    }
  };

  const handleDrawerTransferStock = async () => {
    if (!drawerProduct) return;
    try {
      await transferStock({ variables: { id: drawerProduct.id, stock: parseInt(drawerTransferInput, 10) || 0 } });
      setDrawerTransferInput("");
    } catch (err) {
      console.error(err);
      alert("Failed to transfer stock. Check console.");
    }
  };

  const renderCustomDot = ({ cx, cy, payload, dataKey, index }) => {
    if (!payload) return null;
    if (dataKey === "stock" && Number(payload.stock) < Number(payload.demand))
      return <circle key={`stock-shortage-${payload.id || index}`} cx={cx} cy={cy} r={6} stroke="red" strokeWidth={2} fill="white" />;
    if (dataKey === "stock") return <circle key={`stock-${payload.id || index}`} cx={cx} cy={cy} r={5} fill="#3b82f6" />;
    if (dataKey === "demand") return <circle key={`demand-${payload.id || index}`} cx={cx} cy={cy} r={5} fill="#ef4444" />;
    return null;
  };

  const safeTooltipFormatter = (value, name) => {
    if (name === "fillRate") {
      const n = Number(value);
      return [Number.isFinite(n) ? `${Math.round(n)}%` : "—", "Fill Rate"];
    }
    return [value ?? "—", String(name)];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h1 className="text-2xl font-semibold">SupplySight</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <h2 className="text-3xl font-bold text-gray-900">Daily Inventory Dashboard</h2>

        {/* KPI Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Stock" value={totalStock.toLocaleString()} />
          <StatCard label="Total Demand" value={totalDemand.toLocaleString()} />
          <StatCard label="Fill Rate" value={`${fillRate}%`} />
        </div>

        {/* Two-column layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Left Column */}
          <div className="flex flex-col space-y-6">
            <div className="bg-white shadow-sm p-9 sm:p-9 rounded-xl h-64 sm:h-80 md:h-96">
              <h3 className="text-lg font-semibold mb-2">Stock vs Demand</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={safeTooltipFormatter} />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="stock" stroke="#3b82f6" strokeWidth={2} dot={renderCustomDot} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="demand" stroke="#ef4444" dot={renderCustomDot} strokeWidth={2} />
                  <Line type="monotone" dataKey="fillRate" stroke="#facc15" strokeWidth={2} dot={{ r: 4 }} name="Fill Rate (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white shadow-sm p-4 sm:p-6 rounded-xl overflow-x-auto">
              <ProductsTable products={paginatedProducts} onRowClick={handleRowClick} />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-6">
            {/* Filters & Date */}
            <div className="bg-white border rounded-xl shadow-sm p-4">
              <h3 className="text-md font-semibold mb-3">Date Range</h3>
              <div className="flex gap-2">
                {["7d", "14d", "30d"].map((r) => (
                  <button
                    key={r}
                    className={`px-3 py-1 rounded-full border text-sm cursor-pointer ${
                      selectedRange === r ? "bg-blue-500 text-white border-blue-500" : "bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                    onClick={() => setSelectedRange(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Cutoff date: {cutoffDate.toDateString()}</p>
            </div>

            <div className="bg-white border rounded-xl shadow-sm p-4">
              <h3 className="text-md font-semibold mb-3">Interactions — Filters (live)</h3>
              <div className="space-y-3">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or SKU"
                  className="w-full border rounded p-2"
                />
                <select
                  value={warehouseFilter}
                  onChange={(e) => setWarehouseFilter(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="">All warehouses</option>
                  {warehouses.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">Filters update the chart and table immediately.</p>
              </div>
            </div>

            {/* Pagination */}
            <div className="bg-white border rounded-xl shadow-sm p-2 mt-auto">
              <h3 className="text-md font-semibold mb-2">Pages</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((page) => {
                  const startIndex = (page - 1) * itemsPerPage;
                  const hasProducts = displayedProducts.slice(startIndex, startIndex + itemsPerPage).length > 0;
                  return (
                    <button
                      key={page}
                      onClick={() => hasProducts && setCurrentPage(page)}
                      className={`px-3 py-1 rounded border text-sm ${
                        currentPage === page ? "bg-blue-500 text-white border-blue-500" : "bg-gray-100 text-gray-700 border-gray-200"
                      } ${!hasProducts ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed top-0 right-0 h-full z-50 w-full sm:w-96 bg-white shadow-xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold">{drawerProduct?.name}</h4>
              <p className="text-sm text-gray-500">{drawerProduct?.sku}</p>
            </div>
            <button onClick={closeDrawer} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer">
              Close
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-4 flex-1 overflow-auto space-y-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-700"><strong>Warehouse:</strong> {drawerProduct?.warehouse || "—"}</p>
              <p className="text-sm text-gray-700"><strong>Status:</strong> {drawerProduct?.status || "—"}</p>
              <p className="text-sm text-gray-700"><strong>Stock:</strong> {drawerProduct?.stock ?? "—"}</p>
              <p className="text-sm text-gray-700"><strong>Demand:</strong> {drawerProduct?.demand ?? "—"}</p>
            </div>

            <div>
              <h5 className="font-medium">Update Demand</h5>
              <input
                type="number"
                value={drawerDemandInput}
                onChange={(e) => setDrawerDemandInput(e.target.value)}
                className="border p-2 rounded w-full mt-2"
              />
              <div className="mt-2 flex gap-2">
                <button onClick={handleDrawerUpdateDemand} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
                  Save
                </button>
                <button onClick={() => setDrawerDemandInput(drawerProduct?.demand != null ? String(drawerProduct.demand) : "")} className="px-4 py-2 border rounded cursor-pointer">
                  Reset
                </button>
              </div>
            </div>

            <div>
              <h5 className="font-medium">Transfer Stock</h5>
              <input
                type="number"
                value={drawerTransferInput}
                onChange={(e) => setDrawerTransferInput(e.target.value)}
                className="border p-2 rounded w-full mt-2"
              />
              <div className="mt-2 flex gap-2">
                <button onClick={handleDrawerTransferStock} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">
                  Transfer
                </button>
                <button onClick={() => setDrawerTransferInput("")} className="px-4 py-2 border rounded cursor-pointer">
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

