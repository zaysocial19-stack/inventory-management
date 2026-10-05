import { useState } from 'react'
import { type Product } from './ProductCard'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onAddProduct: (product: Omit<Product, 'id'>) => void
}

export function AddProductModal({ isOpen, onClose, onAddProduct }: AddProductModalProps) {
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [category, setCategory] = useState('Beverages')
  const [price, setPrice] = useState('')
  const [stockQuantity, setStockQuantity] = useState('')
  const [minStockThreshold, setMinStockThreshold] = useState('10')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault() // Prevents the browser from reloading the page

    // Basic Validation
    if (!name.trim() || !sku.trim()) {
      setError('Product name and SKU are required.')
      return
    }

    const parsedPrice = parseFloat(price)
    const parsedStock = parseInt(stockQuantity, 10)
    const parsedThreshold = parseInt(minStockThreshold, 10)

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Please enter a valid price greater than $0.')
      return
    }

    if (isNaN(parsedStock) || parsedStock < 0) {
      setError('Please enter a valid stock quantity.')
      return
    }

    // Submit to parent
    onAddProduct({
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      category,
      price: parsedPrice,
      stockQuantity: parsedStock,
      minStockThreshold: isNaN(parsedThreshold) ? 5 : parsedThreshold,
    })

    // Reset and close
    setName('')
    setSku('')
    setPrice('')
    setStockQuantity('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-white">Add New Product</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-800/80 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name</label>
            <input
              type="text"
              placeholder="e.g. Organic Matcha Powder"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">SKU</label>
              <input
                type="text"
                placeholder="e.g. TEA-MAT-01"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Beverages">Beverages</option>
                <option value="Dairy Alternatives">Dairy Alternatives</option>
                <option value="Bakery">Bakery</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Stock</label>
              <input
                type="number"
                placeholder="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Min Threshold</label>
              <input
                type="number"
                placeholder="10"
                value={minStockThreshold}
                onChange={(e) => setMinStockThreshold(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white cursor-pointer transition-colors shadow-sm"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
