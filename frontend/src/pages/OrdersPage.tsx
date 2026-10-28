import { useState } from 'react';
import { useOrders, useUpdateOrderStatus } from '../api/queries';
import { CreateOrderModal } from '../components/CreateOrderModal';
import { useAuth } from '../context/AuthContext';

export function OrdersPage() {
  const { hasRole } = useAuth();
  const canManage = hasRole(['ADMIN', 'MANAGER']);

  // Instant render from TanStack Query cache!
  const { data: orders = [], isLoading, error } = useOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateStatus = async (orderId: string, status: 'COMPLETED' | 'CANCELLED') => {
    try {
      await updateStatusMutation.mutateAsync({ id: orderId, status });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Customer Orders & Sales</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time Point-of-Sale (POS) checkouts and historical revenue ledger
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            {orders.length} Orders
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white transition-colors cursor-pointer shadow-sm shadow-emerald-950/40"
          >
            + New Checkout
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs">
          Failed to load orders history.
        </div>
      )}

      {isLoading && orders.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading order history...</div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-slate-800/40 rounded-xl border border-slate-800">
          <h3 className="text-sm font-semibold text-white">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Create your first checkout transaction to see live inventory deduction!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-sky-600 hover:bg-sky-500 text-white cursor-pointer"
          >
            Open POS Register
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-800/40">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700/60">
              <tr>
                <th className="py-3 px-4">Order Number</th>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Cashier</th>
                <th className="py-3 px-4">Line Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                {canManage && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {orders.map((order) => {
                const total =
                  typeof order.totalAmount === 'number'
                    ? order.totalAmount
                    : parseFloat(order.totalAmount) || 0;

                return (
                  <tr key={order.id} className="hover:bg-slate-800/50 transition-colors text-xs">
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200">
                      {order.createdBy?.fullName || 'Cashier'}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {order.items?.map((item) => (
                        <div key={item.id} className="text-[11px]">
                          {item.quantity}× {item.product?.name || 'Item'} (${Number(item.unitPrice).toFixed(2)})
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400 text-sm">
                      ${total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                          order.status === 'COMPLETED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                            : order.status === 'CANCELLED'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800/60'
                            : 'bg-amber-950 text-amber-400 border border-amber-800/60'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    {canManage && (
                      <td className="py-3 px-4 text-right">
                        {order.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                            disabled={updateStatusMutation.isPending}
                            className="px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 transition-colors cursor-pointer border border-slate-700 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <CreateOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
