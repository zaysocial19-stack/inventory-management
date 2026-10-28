import { useState, useMemo } from 'react';
import { useInventory, useMovements } from '../api/queries';
import { ReceiveStockModal } from '../components/ReceiveStockModal';
import { useAuth } from '../context/AuthContext';

export function InventoryPage() {
  const { hasRole } = useAuth();
  const canAudit = hasRole(['ADMIN', 'MANAGER']);

  // Instant render from TanStack Query cache!
  const { data: inventory = [], isLoading: invLoading } = useInventory();
  const { data: movements = [] } = useMovements(canAudit);

  const [activeTab, setActiveTab] = useState<'stock' | 'audit'>('stock');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);
  const [movementTypeFilter, setMovementTypeFilter] = useState<'ALL' | 'IN' | 'OUT' | 'ADJUSTMENT'>('ALL');
  
  const [restockProduct, setRestockProduct] = useState<{
    id: string;
    name: string;
    sku: string;
    currentStock: number;
  } | null>(null);

  // Memoized filter for Stock Levels tab
  const filteredInventory = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return inventory.filter((item) => {
      const matchesSearch =
        !term ||
        item.product.name.toLowerCase().includes(term) ||
        item.product.sku.toLowerCase().includes(term) ||
        (item.product.category?.name || '').toLowerCase().includes(term);

      const matchesLowStock = filterLowStockOnly ? item.isLowStock : true;
      return matchesSearch && matchesLowStock;
    });
  }, [inventory, searchTerm, filterLowStockOnly]);

  // Memoized filter for Audit tab
  const filteredMovements = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return movements.filter((m) => {
      const matchesType = movementTypeFilter === 'ALL' || m.type === movementTypeFilter;
      const matchesSearch =
        !term ||
        (m.reason || '').toLowerCase().includes(term) ||
        (m.user?.fullName || '').toLowerCase().includes(term);
      return matchesType && matchesSearch;
    });
  }, [movements, movementTypeFilter, searchTerm]);

  const lowStockCount = useMemo(() => inventory.filter((i) => i.isLowStock).length, [inventory]);
  const isLoading = invLoading && inventory.length === 0;

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Inventory & Stock Ledger</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Physical stock tracking and immutable movement audit log
          </p>
        </div>

        {/* View Switcher: Instant Tab Switching */}
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => {
              setActiveTab('stock');
              setSearchTerm('');
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'stock'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Stock Levels ({inventory.length})
          </button>
          {canAudit && (
            <button
              onClick={() => {
                setActiveTab('audit');
                setSearchTerm('');
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Movement Audit ({movements.length})
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-800/40 p-3 rounded-xl border border-slate-800 mb-4">
        {/* Real-time search bar */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            placeholder={
              activeTab === 'stock'
                ? 'Search by item name, SKU, or category...'
                : 'Search audit notes or staff name...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-8 py-2 text-xs rounded-lg bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tab-specific Controls */}
        {activeTab === 'stock' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                filterLowStockOnly
                  ? 'bg-rose-950/80 border-rose-700 text-rose-300 shadow-xs'
                  : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <span>🚨 Low Stock Only</span>
              {lowStockCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-600 text-white font-bold">
                  {lowStockCount}
                </span>
              )}
            </button>
          </div>
        ) : (
          /* Movement Audit Type Filter Pills */
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-700/80 text-[11px]">
            {(['ALL', 'IN', 'OUT', 'ADJUSTMENT'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMovementTypeFilter(type)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  movementTypeFilter === type
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading inventory...</div>
      ) : activeTab === 'stock' ? (
        filteredInventory.length === 0 ? (
          <div className="p-12 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
            No inventory items matched your search filters.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-800/40">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700/60">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Status</th>
                  {canAudit && <th className="py-3 px-4 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">{item.product.name}</td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-400">
                      {item.product.sku}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {item.product.category?.name || 'General'}
                    </td>
                    <td className="py-3 px-4 font-semibold">{item.stockQuantity} units</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          item.isLowStock
                            ? 'bg-red-950/80 text-red-400 border border-red-800/60'
                            : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                        }`}
                      >
                        {item.isLowStock ? 'Low Stock' : 'Optimal'}
                      </span>
                    </td>
                    {canAudit && (
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() =>
                            setRestockProduct({
                              id: item.productId,
                              name: item.product.name,
                              sku: item.product.sku,
                              currentStock: item.stockQuantity,
                            })
                          }
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white transition-colors cursor-pointer shadow-xs"
                        >
                          Receive Stock...
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        /* Audit Log Table */
        filteredMovements.length === 0 ? (
          <div className="p-12 text-center bg-slate-800/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
            No stock movements found for the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-800/40">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700/60">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Qty</th>
                  <th className="py-3 px-4">Reason / Notes</th>
                  <th className="py-3 px-4">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredMovements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/50 transition-colors text-xs">
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(m.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          m.type === 'IN'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                            : m.type === 'OUT'
                            ? 'bg-red-950 text-red-400 border border-red-800/60'
                            : 'bg-amber-950 text-amber-400 border border-amber-800/60'
                        }`}
                      >
                        {m.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {m.type === 'IN' ? `+${m.quantity}` : `-${m.quantity}`}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{m.reason || '—'}</td>
                    <td className="py-3 px-4 text-slate-400">{m.user?.fullName || 'System'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Stock Intake Confirmation Modal */}
      {restockProduct && (
        <ReceiveStockModal
          isOpen={!!restockProduct}
          onClose={() => setRestockProduct(null)}
          product={restockProduct}
        />
      )}
    </div>
  );
}
