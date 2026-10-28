import { useSuppliers, useProducts } from '../api/queries';

export function SuppliersPage() {
  const { data: suppliers = [], isLoading: suppLoading } = useSuppliers();
  const { data: products = [] } = useProducts();

  const isLoading = suppLoading && suppliers.length === 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Vendor & Supplier Directory</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage commercial distributors, contact information, and supplied catalog items
          </p>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
          {suppliers.length} Active Vendors
        </span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 bg-slate-800/60 rounded-xl border border-slate-800" />
          ))}
        </div>
      ) : suppliers.length === 0 ? (
        <div className="p-12 text-center bg-slate-800/40 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-sm">No suppliers registered in database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((supplier) => {
            // Find products linked to this supplier
            const linkedProducts = products.filter((p) => p.supplierId === supplier.id);

            return (
              <div
                key={supplier.id}
                className="flex flex-col p-5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider">
                      Verified Supplier
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{supplier.name}</h3>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-medium">
                    {linkedProducts.length} Products
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                  {supplier.contactEmail && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">✉️</span>
                      <a
                        href={`mailto:${supplier.contactEmail}`}
                        className="text-sky-400 hover:underline"
                      >
                        {supplier.contactEmail}
                      </a>
                    </div>
                  )}
                  {supplier.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">📞</span>
                      <span>{supplier.phone}</span>
                    </div>
                  )}
                </div>

                {/* Linked Products Tags */}
                <div className="mt-auto pt-3 border-t border-slate-700/60">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
                    Supplied Catalog Items:
                  </span>
                  {linkedProducts.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">No products assigned</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {linkedProducts.map((p) => (
                        <span
                          key={p.id}
                          className="px-2 py-0.5 rounded text-[11px] bg-slate-900/90 text-slate-300 border border-slate-700"
                        >
                          {p.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
