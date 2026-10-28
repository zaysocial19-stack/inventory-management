import { useState, useMemo } from 'react';
import { useProducts, useCategories, useReceiveStock } from '../api/queries';
import { ProductCard } from '../components/ProductCard';
import { AddProductModal } from '../components/AddProductModal';
import { useAuth } from '../context/AuthContext';

export function ProductsPage() {
  const { hasRole } = useAuth();
  const canAdd = hasRole(['ADMIN', 'MANAGER']);

  const { data: products = [], isLoading, error } = useProducts();
  const { data: categories = [] } = useCategories();
  const receiveMutation = useReceiveStock();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'LOW' | 'OPTIMAL'>('ALL');
  const [sortBy, setSortBy] = useState<'NAME_ASC' | 'PRICE_ASC' | 'PRICE_DESC' | 'STOCK_ASC'>('NAME_ASC');

  // Quick Restock handler
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

  // Real-time zero-delay in-memory filtering & sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q));

        const matchesCategory = !selectedCategory || p.categoryId === selectedCategory;

        const stock = p.inventory?.stockQuantity ?? 0;
        const minStock = p.inventory?.minStockThreshold ?? 10;
        const isLow = stock <= minStock;

        const matchesStock =
          stockFilter === 'ALL' ||
          (stockFilter === 'LOW' && isLow) ||
          (stockFilter === 'OPTIMAL' && !isLow);

        return matchesQuery && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        if (sortBy === 'PRICE_ASC') return priceA - priceB;
        if (sortBy === 'PRICE_DESC') return priceB - priceA;
        const stockA = a.inventory?.stockQuantity ?? 0;
        const stockB = b.inventory?.stockQuantity ?? 0;
        if (sortBy === 'STOCK_ASC') return stockA - stockB;
        return 0;
      });
  }, [products, searchQuery, selectedCategory, stockFilter, sortBy]);

  const lowStockCount = products.filter(
    (p) => (p.inventory?.stockQuantity ?? 0) <= (p.inventory?.minStockThreshold ?? 10)
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Product Catalog</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Store inventory, database pricing, and stock management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            {filteredProducts.length} of {products.length} Products
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

      {/* Real-time Search & Filter Toolbar */}
      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800 mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by name, SKU (e.g. COF-COL-002)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="NAME_ASC">Name (A-Z)</option>
            <option value="PRICE_ASC">Price: Low to High</option>
            <option value="PRICE_DESC">Price: High to Low</option>
            <option value="STOCK_ASC">Stock: Lowest First</option>
          </select>
        </div>

        {/* Stock Filter Pills */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => setStockFilter('ALL')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              stockFilter === 'ALL'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStockFilter('LOW')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              stockFilter === 'LOW'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-red-400 hover:text-red-300'
            }`}
          >
            <span>Low Stock</span>
            {lowStockCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-950 text-red-300 border border-red-800">
                {lowStockCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setStockFilter('OPTIMAL')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              stockFilter === 'OPTIMAL'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            Optimal
          </button>
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
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-slate-800/40 rounded-xl border border-slate-800">
          <p className="text-slate-300 text-sm font-semibold">No matching products found</p>
          <p className="text-slate-500 text-xs mt-1">
            Try adjusting your search query, category, or stock status filter.
          </p>
          {(searchQuery || selectedCategory || stockFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setStockFilter('ALL');
              }}
              className="mt-3 px-3 py-1.5 text-xs text-sky-400 hover:underline cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
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
