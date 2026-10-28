import { useState, useEffect } from 'react';
import { productsApi } from '../api/products';
import type { Category, Supplier } from '../types/api';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export function AddProductModal({ isOpen, onClose, onProductAdded }: AddProductModalProps) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [initialStock, setInitialStock] = useState('20');
  const [minStockThreshold, setMinStockThreshold] = useState('10');

  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch dropdown categories and suppliers on mount/open
  useEffect(() => {
    if (!isOpen) return;

    async function loadMeta() {
      try {
        const [cats, supps] = await Promise.all([
          productsApi.getCategories(),
          productsApi.getSuppliers(),
        ]);
        setCategories(cats);
        setSuppliers(supps);
        if (cats.length > 0) setSelectedCategoryId(cats[0].id);
        if (supps.length > 0) setSelectedSupplierId(supps[0].id);
      } catch (err: any) {
        console.error('Failed to load categories/suppliers:', err);
      }
    }

    loadMeta();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !sku.trim()) {
      setError('Product name and SKU are required.');
      return;
    }

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(initialStock, 10);
    const parsedThreshold = parseInt(minStockThreshold, 10);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Please enter a valid price greater than $0.');
      return;
    }

    if (!selectedCategoryId) {
      setError('Please select a valid category.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await productsApi.create({
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        description: description.trim() || undefined,
        price: parsedPrice,
        categoryId: selectedCategoryId,
        supplierId: selectedSupplierId || undefined as any,
        initialStock: isNaN(parsedStock) ? 0 : parsedStock,
        minStockThreshold: isNaN(parsedThreshold) ? 5 : parsedThreshold,
      });

      // Reset and trigger refresh
      setName('');
      setSku('');
      setDescription('');
      setPrice('');
      setInitialStock('20');
      setError(null);
      onProductAdded();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to create product. Check that SKU is unique.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white">Add New Product</h2>
            <p className="text-xs text-slate-400 mt-0.5">Create item in PostgreSQL inventory catalog</p>
          </div>
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name *</label>
            <input
              type="text"
              placeholder="e.g. Organic Matcha Powder"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">SKU *</label>
              <input
                type="text"
                placeholder="e.g. TEA-MAT-01"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Supplier</label>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Stock</label>
              <input
                type="number"
                placeholder="20"
                value={initialStock}
                onChange={(e) => setInitialStock(e.target.value)}
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

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
            <textarea
              rows={2}
              placeholder="Product notes, taste profile, or storage instructions"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
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
              disabled={loading}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white cursor-pointer transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
