import { useState } from 'react';
import { useInventory, useMovements, useReceiveStock } from '../api/queries';
import { useAuth } from '../context/AuthContext';

export function InventoryPage() {
  const { hasRole } = useAuth();
  const canAudit = hasRole(['ADMIN', 'MANAGER']);

  // Instant render from TanStack Query cache!
  const { data: inventory = [], isLoading: invLoading } = useInventory();
  const { data: movements = [] } = useMovements(canAudit);
  const receiveMutation = useReceiveStock();

  const [activeTab, setActiveTab] = useState<'stock' | 'audit'>('stock');

  const handleReceiveQuick = async (productId: string) => {
    try {
      await receiveMutation.mutateAsync({
        productId,
        quantity: 10,
        notes: 'Restock shipment received (+10 units)',
      });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to receive stock');
    }
  };

  const isLoading = invLoading && inventory.length === 0;

  return (
    <div>
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
            onClick={() => setActiveTab('stock')}
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
              onClick={() => setActiveTab('audit')}
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

      {isLoading ? (
        <div className="p-8 text-center text-slate-400 text-sm">Loading inventory...</div>
      ) : activeTab === 'stock' ? (
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
              {inventory.map((item) => (
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
                        onClick={() => handleReceiveQuick(item.productId)}
                        disabled={receiveMutation.isPending}
                        className="px-2.5 py-1 text-xs font-medium rounded bg-slate-700 hover:bg-sky-600 text-slate-200 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                      >
                        +10 Receive
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Audit Log Table */
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
              {movements.map((m) => (
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
      )}
    </div>
  );
}
