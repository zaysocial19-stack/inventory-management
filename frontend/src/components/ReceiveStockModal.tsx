import { useState, useEffect } from 'react';
import { useReceiveStock } from '../api/queries';

interface ReceiveStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    sku: string;
    currentStock: number;
  } | null;
}

export function ReceiveStockModal({ isOpen, onClose, product }: ReceiveStockModalProps) {
  const receiveMutation = useReceiveStock();
  const [quantity, setQuantity] = useState(10);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuantity(10);
      setNotes('Supplier restock delivery');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const newStockPreview = product.currentStock + (parseInt(String(quantity), 10) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedQty = parseInt(String(quantity), 10);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      setError('Please enter a valid received quantity greater than 0.');
      return;
    }

    try {
      await receiveMutation.mutateAsync({
        productId: product.id,
        quantity: parsedQty,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to receive stock shipment.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">Receive Stock Shipment</h2>
            <p className="text-xs text-slate-400 mt-0.5">Physical intake verification & audit</p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Summary Card */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Item to Restock
            </span>
            <div className="text-sm font-bold text-white mt-1">{product.name}</div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">SKU: {product.sku}</div>
          </div>

          {/* Quantity Input & Real-Time Calculation */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Quantity Received *
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
              required
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
            />
            {/* Live Calculation Preview */}
            <div className="mt-2 flex items-center justify-between px-3 py-2 bg-slate-800/40 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400">Stock Result:</span>
              <span className="font-semibold text-emerald-400">
                {product.currentStock} + {quantity || 0} = {newStockPreview} units
              </span>
            </div>
          </div>

          {/* Supplier PO / Delivery Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Delivery Invoice / PO Reference (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Invoice #PO-9842 from Artisan Bakery"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={receiveMutation.isPending}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white cursor-pointer transition-colors shadow-sm disabled:opacity-50"
            >
              {receiveMutation.isPending ? 'Logging Intake...' : 'Confirm Shipment Intake'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
