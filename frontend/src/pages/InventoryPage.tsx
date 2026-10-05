import { type Product } from '../components/ProductCard'

interface InventoryPageProps {
  products: Product[]
}

export function InventoryPage({ products }: InventoryPageProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Inventory Movements & Stock</h2>
        <p className="text-xs text-slate-400 mt-0.5">Real-time stock audit and history</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-800/40">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700/60">
            <tr>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Current Stock</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {products.map((p) => {
              const isLow = p.stockQuantity <= p.minStockThreshold
              return (
                <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-white">{p.name}</td>
                  <td className="py-3 px-4 text-xs font-mono text-slate-400">{p.sku}</td>
                  <td className="py-3 px-4 text-xs">{p.category}</td>
                  <td className="py-3 px-4 font-semibold">{p.stockQuantity} units</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        isLow
                          ? 'bg-red-950/80 text-red-400 border border-red-800/60'
                          : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                      }`}
                    >
                      {isLow ? 'Low Stock' : 'Optimal'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
