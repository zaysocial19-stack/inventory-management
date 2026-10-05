import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { ProductsPage } from './pages/ProductsPage'
import { InventoryPage } from './pages/InventoryPage'
import { OrdersPage } from './pages/OrdersPage'
import { type Product } from './components/ProductCard'

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Arabica Coffee Beans 1kg', sku: 'COF-ARA-01', category: 'Beverages', price: 24.50, stockQuantity: 12, minStockThreshold: 15 },
  { id: '2', name: 'Oat Milk 1L', sku: 'MLK-OAT-01', category: 'Dairy Alternatives', price: 3.80, stockQuantity: 28, minStockThreshold: 10 },
  { id: '3', name: 'Chocolate Croissant', sku: 'BAK-CRO-02', category: 'Bakery', price: 4.25, stockQuantity: 3, minStockThreshold: 8 },
]

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)

  const handleQuickAddStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stockQuantity: p.stockQuantity + 5 } : p))
    )
  }

  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: Date.now().toString(),
    }
    setProducts((prev) => [newProduct, ...prev])
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Index route: renders when URL is exact '/' */}
          <Route index element={<DashboardPage products={products} />} />
          <Route
            path="products"
            element={
              <ProductsPage
                products={products}
                onQuickAddStock={handleQuickAddStock}
                onAddProduct={handleAddProduct}
              />
            }
          />
          <Route path="inventory" element={<InventoryPage products={products} />} />
          <Route path="orders" element={<OrdersPage />} />
          {/* Fallback: redirect any unknown URL to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
