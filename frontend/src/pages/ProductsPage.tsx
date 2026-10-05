import { useState } from 'react'
import { ProductCard, type Product } from '../components/ProductCard'
import { AddProductModal } from '../components/AddProductModal'

interface ProductsPageProps {
  products: Product[]
  onQuickAddStock: (id: string) => void
  onAddProduct: (product: Omit<Product, 'id'>) => void
}

export function ProductsPage({ products, onQuickAddStock, onAddProduct }: ProductsPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Product Catalog</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage store items, pricing, and stock levels</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            {products.length} Products
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white transition-colors cursor-pointer shadow-sm shadow-sky-950/40"
          >
            + Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickAddStock={onQuickAddStock}
          />
        ))}
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={onAddProduct}
      />
    </div>
  )
}
