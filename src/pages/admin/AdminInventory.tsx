import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, AlertTriangle, CheckCircle2, PackageX, Plus, Minus } from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { products, updateProductStock, siteSettings, showToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<'all' | 'low' | 'out'>('all');

  const filtered = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q));
    if (!matchesSearch) return false;
    if (filterState === 'low') return p.stock > 0 && p.stock <= 5;
    if (filterState === 'out') return p.stock === 0;
    return true;
  });

  const handleAdjust = (productId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    updateProductStock(productId, newStock);
    showToast('Stock Updated', `Inventory adjusted to ${newStock} units`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-3xl border border-[#2D1810]/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#23120B]">
            Bakery Inventory &amp; Batch Stock
          </h3>
          <p className="text-xs text-[#3E2723]/60">
            Real-time batch tracking for fresh daily production.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-[#3E2723]/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SKU..."
              className="pl-9 pr-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
            />
          </div>

          <div className="flex bg-[#FAF7F2] p-1 rounded-xl border border-[#2D1810]/10 text-xs">
            <button
              onClick={() => setFilterState('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                filterState === 'all' ? 'bg-[#23120B] text-white shadow-2xs' : 'text-[#23120B]'
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setFilterState('low')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                filterState === 'low' ? 'bg-[#23120B] text-white shadow-2xs' : 'text-[#23120B]'
              }`}
            >
              Low ({products.filter((p) => p.stock > 0 && p.stock <= 5).length})
            </button>
            <button
              onClick={() => setFilterState('out')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                filterState === 'out' ? 'bg-[#23120B] text-white shadow-2xs' : 'text-[#23120B]'
              }`}
            >
              Out of Stock ({products.filter((p) => p.stock === 0).length})
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-[#2D1810]/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#FAF7F2] text-[#3E2723]/70 uppercase text-[10px] tracking-wider border-b border-[#2D1810]/10">
                <th className="p-4">Confectionery</th>
                <th className="p-4">SKU Code</th>
                <th className="p-4">Unit Price</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-right">Quick Batch Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D1810]/5">
              {filtered.map((product) => {
                const isOut = product.stock === 0;
                const isLow = product.stock > 0 && product.stock <= 5;
                return (
                  <tr key={product.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=80'}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-xl bg-white border border-[#2D1810]/10 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-sm text-[#23120B]">{product.name}</p>
                          <p className="text-[11px] text-[#3E2723]/60">{product.weight || 'Standard'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-semibold text-[#3E2723]">
                      {product.sku || 'N/A'}
                    </td>

                    <td className="p-4 font-semibold text-[#23120B]">
                      {siteSettings.currencySymbol}{product.price}
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-base text-[#23120B]">
                        {product.stock}
                      </span>
                    </td>

                    <td className="p-4">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <PackageX className="w-3 h-3" />
                          <span>Sold Out</span>
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Low ({product.stock} left)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>In Stock</span>
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleAdjust(product.id, product.stock, -1)}
                          disabled={product.stock === 0}
                          className="w-7 h-7 bg-[#FAF7F2] hover:bg-[#EADBC8]/40 border border-[#2D1810]/15 rounded-lg font-bold flex items-center justify-center text-[#23120B] disabled:opacity-30"
                          title="Decrease 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleAdjust(product.id, product.stock, 5)}
                          className="px-2.5 py-1 bg-[#FAF7F2] hover:bg-[#EADBC8]/40 border border-[#2D1810]/15 rounded-lg font-bold text-xs text-[#23120B]"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => handleAdjust(product.id, product.stock, 10)}
                          className="px-2.5 py-1 bg-[#23120B] hover:bg-[#C59B27] text-white rounded-lg font-bold text-xs"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleAdjust(product.id, product.stock, 25)}
                          className="px-2.5 py-1 bg-[#C59B27] hover:bg-[#DFB15B] text-[#23120B] rounded-lg font-bold text-xs"
                        >
                          +25
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
