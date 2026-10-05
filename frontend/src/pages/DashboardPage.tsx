import { Link } from 'react-router-dom'
import { type Product } from '../components/ProductCard'

interface DashboardPageProps {
  products: Product[]
}

export function DashboardPage({ products }: DashboardPageProps) {
  const totalProducts = products.length
  
  // Calculate total inventory value: sum of (price * quantity) for all items
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stockQuantity, 0)
  
  // Find low stock items
  const lowStockItems = products.filter((p) => p.stockQuantity <= p.minStockThreshold)

  return (
    <div className="flex flex-col gap-8">
      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Products
          </span>
          <div className="text-3xl font-bold text-white mt-2">{totalProducts}</div>
          <p className="text-xs text-slate-400 mt-1">Active items in catalog</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Inventory Value
          </span>
          <div className="text-3xl font-bold text-sky-400 mt-2">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-400 mt-1">Retail value of stock on hand</p>
        </div>

        <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Low Stock Alerts
          </span>
          <div className={`text-3xl font-bold mt-2 ${lowStockItems.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {lowStockItems.length}
          </div>
          <p className="text-xs text-slate-400 mt-1">Items at or below min threshold</p>
        </div>
      </div>

      {/* Low Stock Attention Box */}
      {lowStockItems.length > 0 && (
        <div className="p-5 rounded-xl bg-red-950/30 border border-red-900/60">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-red-300">Items Needing Restock</h3>
            <Link
              to="/products"
              className="text-xs text-red-400 hover:text-red-300 underline font-medium"
            >
              View in Products →
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2 px-3 rounded-lg bg-slate-900/60 text-xs"
              >
                <span className="font-medium text-slate-200">{item.name}</span>
                <span className="text-red-400 font-semibold">
                  {item.stockQuantity} left (min: {item.minStockThreshold})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
