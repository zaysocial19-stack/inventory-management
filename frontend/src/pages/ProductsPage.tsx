import { useState } from 'react';
import { useProducts, useReceiveStock } from '../api/queries';
import { ProductCard } from '../components/ProductCard';
import { AddProductModal } from '../components/AddProductModal';
import { useAuth } from '../context/AuthContext';

export function ProductsPage() {
  const { hasRole } = useAuth();
  const canAdd = hasRole(['ADMIN', 'MANAGER']);

  // Instant render from memory cache!
  const { data: products = [], isLoading, error } = useProducts();
  const receiveMutation = useReceiveStock();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Quick Restock handler: mutates and automatically invalidates cache across app!
  const handleQuickAddStock = async (productId: string) => {
    try {
      await receiveMutation.mutateAsync({
        productId,
        quantity: 5,
        notes: 'Quick restock from Product Catalog',
      });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update stock quantity.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Product Catalog</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Store inventory, database pricing, and stock management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            {products.length} Products
          </span>
          {canAdd && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white transition-colors cursor-pointer shadow-sm shadow-sky-950/40"
            >
              + Add Product
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs">
          Failed to load product catalog.
        </div>
      )}

      {isLoading && products.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-slate-800/60 rounded-xl border border-slate-800" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center bg-slate-800/40 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-sm">No products found in catalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickAddStock={handleQuickAddStock}
            />
          ))}
        </div>
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={() => {}}
      />
    </div>
  );
}
