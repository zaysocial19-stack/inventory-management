export interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stockQuantity: number
  minStockThreshold: number
}

interface ProductCardProps {
  product: Product
  onQuickAddStock: (id: string) => void
}

export function ProductCard({ product, onQuickAddStock }: ProductCardProps) {
  const isLowStock = product.stockQuantity <= product.minStockThreshold

  return (
    <div
      className={`flex flex-col gap-3 p-5 rounded-xl bg-slate-800/90 border transition-all duration-200 ${
        isLowStock
          ? 'border-red-500/80 shadow-lg shadow-red-950/20'
          : 'border-slate-700/80 hover:border-slate-600'
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {product.category} • SKU: {product.sku}
          </span>
          <h3 className="text-base font-semibold text-slate-100 mt-1">
            {product.name}
          </h3>
        </div>
        <span className="text-lg font-bold text-sky-400 whitespace-nowrap">
          ${product.price.toFixed(2)}
        </span>
      </div>

      <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-700/60">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Stock:</span>
          <span className={`text-sm font-semibold ${isLowStock ? 'text-red-400' : 'text-emerald-400'}`}>
            {product.stockQuantity} units
          </span>
          {isLowStock && (
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-red-950/80 text-red-300 border border-red-800/60">
              Low Stock
            </span>
          )}
        </div>

        <button
          onClick={() => onQuickAddStock(product.id)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white transition-colors cursor-pointer shadow-sm shadow-sky-950/30"
        >
          + Add Stock
        </button>
      </div>
    </div>
  )
}
