import { useState, useEffect } from 'react';
import { useProducts, useCreateOrder } from '../api/queries';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: () => void;
}

interface CartItem {
  productId: string;
  name: string;
  sku: string;
  unitPrice: number;
  availableStock: number;
  quantity: number;
}

export function CreateOrderModal({ isOpen, onClose, onOrderCreated }: CreateOrderModalProps) {
  // Instantly loaded from TanStack Query memory cache (0ms delay!)
  const { data: products = [] } = useProducts();
  const createOrderMutation = useCreateOrder();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
    if (!isOpen) {
      setCart([]);
      setError(null);
    }
  }, [isOpen, products, selectedProductId]);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    const product = products.find((p) => p.id === (selectedProductId || products[0]?.id));
    if (!product) return;

    const available = product.inventory?.stockQuantity ?? 0;
    const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;

    const existingIndex = cart.findIndex((item) => item.productId === product.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += selectedQty;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          unitPrice: price,
          availableStock: available,
          quantity: selectedQty,
        },
      ]);
    }
    setSelectedQty(1);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const orderTotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError('Please add at least one product to the order.');
      return;
    }

    setError(null);

    try {
      await createOrderMutation.mutateAsync({
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      onOrderCreated?.();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Checkout failed. Please verify stock availability.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white">New Checkout Order</h2>
            <p className="text-xs text-slate-400 mt-0.5">Point-of-Sale (POS) atomic inventory sale</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-800 text-xs text-red-200">
            {error}
          </div>
        )}

        {/* Item Picker (Instant zero-delay dropdown!) */}
        <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-800 mb-4">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Select Product & Quantity
          </label>
          <div className="flex gap-2">
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
            >
              {products.map((p) => {
                const stock = p.inventory?.stockQuantity ?? 0;
                return (
                  <option key={p.id} value={p.id}>
                    {p.name} (${Number(p.price).toFixed(2)}) — {stock} in stock
                  </option>
                );
              })}
            </select>

            <input
              type="number"
              min="1"
              value={selectedQty}
              onChange={(e) => setSelectedQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 px-2 py-2 text-xs text-center rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
            />

            <button
              type="button"
              onClick={handleAddToCart}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white cursor-pointer transition-colors"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Cart Review */}
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Order Items ({cart.length})
          </h3>
          {cart.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-800/30 rounded-xl border border-dashed border-slate-800">
              No items in order yet. Pick a product above.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {item.quantity} × ${item.unitPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sky-400">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFromCart(item.productId)}
                      className="text-slate-400 hover:text-red-400 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary & Submit */}
        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
          <div>
            <span className="text-xs text-slate-400 block">Total Due:</span>
            <span className="text-xl font-bold text-emerald-400">${orderTotal.toFixed(2)}</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmitCheckout}
              disabled={createOrderMutation.isPending || cart.length === 0}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white cursor-pointer transition-colors shadow-sm disabled:opacity-50"
            >
              {createOrderMutation.isPending ? 'Processing Transaction...' : 'Complete Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
