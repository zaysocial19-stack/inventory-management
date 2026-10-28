import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts, useLowStock, useOrders } from '../api/queries';
import { ReceiveStockModal } from '../components/ReceiveStockModal';


export function DashboardPage() {
  const { data: products = [], isLoading: pLoading } = useProducts();
  const { data: lowStockItems = [] } = useLowStock();
  const { data: orders = [] } = useOrders();
  
  const [restockProduct, setRestockProduct] = useState<{
  id: string;
  name: string;
  sku: string;
  currentStock: number;
} | null>(null);


  const totalProducts = products.length;

  // Calculate live retail inventory value
  const totalInventoryValue = products.reduce((acc, p) => {
    const price = typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0;
    const qty = p.inventory?.stockQuantity ?? 0;
    return acc + price * qty;
  }, 0);

  // Calculate gross sales revenue from completed orders
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');
  const totalRevenue = completedOrders.reduce((acc, o) => {
    const amount = typeof o.totalAmount === 'number' ? o.totalAmount : parseFloat(o.totalAmount) || 0;
    return acc + amount;
  }, 0);

  const isInitialLoading = pLoading && products.length === 0;

  if (isInitialLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-800/60 rounded-xl border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }
  

  return (
    <div className="flex flex-col gap-6">
      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Revenue
          </span>
          <div className="text-2xl font-bold text-emerald-400 mt-1.5">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">From {completedOrders.length} completed orders</p>
        </div>

        {/* Total Orders */}
        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Orders
          </span>
          <div className="text-2xl font-bold text-sky-400 mt-1.5">{orders.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">POS checkout volume</p>
        </div>

        {/* Inventory Value */}
        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Inventory Value
          </span>
          <div className="text-2xl font-bold text-white mt-1.5">
            ${totalInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{totalProducts} active catalog items</p>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Low Stock Alerts
          </span>
          <div className={`text-2xl font-bold mt-1.5 ${lowStockItems.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {lowStockItems.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Requiring replenishment</p>
        </div>
      </div>

      {/* Two-Column Executive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Urgent Restock Attention List */}
        <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-800 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🚨</span>
              <span>Items Needing Restock</span>
            </h3>
            <Link
              to="/inventory"
              className="text-xs text-sky-400 hover:underline font-medium"
            >
              Inventory Ledger →
            </Link>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 rounded-lg">
              ✓ All products have optimal stock levels.
            </div>
          ) : (
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">{item.product.name}</div>
                    <div className="text-[11px] text-red-400 font-medium">
                      {item.stockQuantity} remaining (Threshold: {item.minStockThreshold})
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setRestockProduct({
                        id: item.productId,
                        name: item.product.name,
                        sku: item.product.sku,
                        currentStock: item.stockQuantity,
                      })
                    }
                    className="px-2.5 py-1 text-xs font-medium rounded bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white transition-colors cursor-pointer"
                  >
                    Restock...
                  </button>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Orders Stream */}
        <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-800 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🧾</span>
              <span>Recent Sales Activity</span>
            </h3>
            <Link
              to="/orders"
              className="text-xs text-sky-400 hover:underline font-medium"
            >
              All Orders →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/40 border border-dashed border-slate-800 rounded-lg">
              No customer checkouts recorded yet.
            </div>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 4).map((order) => {
                const total =
                  typeof order.totalAmount === 'number'
                    ? order.totalAmount
                    : parseFloat(order.totalAmount) || 0;

                return (
                  <div
                    key={order.id}
                    className="flex justify-between items-center p-3 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs"
                  >
                    <div>
                      <span className="font-mono font-semibold text-white">
                        {order.orderNumber}
                      </span>
                      <div className="text-[11px] text-slate-400">
                        Cashier: {order.createdBy?.fullName || 'Cashier'} •{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">${total.toFixed(2)}</div>
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          order.status === 'COMPLETED'
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Step 3: Stock Intake Modal */}
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
