import type { Product } from '../types/api';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onQuickAddStock: (productId: string) => Promise<void>;
}

export function ProductCard({ product, onQuickAddStock }: ProductCardProps) {
  const { hasRole } = useAuth();
  const canManage = hasRole(['ADMIN', 'MANAGER']);

  const stockQuantity = product.inventory?.stockQuantity ?? 0;
  const minStock = product.inventory?.minStockThreshold ?? 10;
  const isLowStock = stockQuantity <= minStock;

  const numericPrice =
    typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;

  const categoryName = product.category?.name ?? 'General';
  const supplierName = product.supplier?.name;

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
            {categoryName} • SKU: {product.sku}
          </span>
          <h3 className="text-base font-semibold text-slate-100 mt-1">
            {product.name}
          </h3>
          {supplierName && (
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Supplier: {supplierName}
            </span>
          )}
        </div>
        <span className="text-lg font-bold text-sky-400 whitespace-nowrap">
          ${numericPrice.toFixed(2)}
        </span>
      </div>

      {product.description && (
        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
          {product.description}
        </p>
      )}

      <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-700/60">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Stock:</span>
          <span className={`text-sm font-semibold ${isLowStock ? 'text-red-400' : 'text-emerald-400'}`}>
            {stockQuantity} units
          </span>
          {isLowStock && (
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-red-950/80 text-red-300 border border-red-800/60">
              Low Stock
            </span>
          )}
        </div>

        {canManage && (
          <button
            onClick={() => onQuickAddStock(product.id)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white transition-colors cursor-pointer shadow-sm shadow-sky-950/30"
          >
            + Add Stock
          </button>
        )}
      </div>
    </div>
  );
}
