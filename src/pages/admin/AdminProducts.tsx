import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductVariant, ProductAddon } from '../../types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Eye,
  X,
  Check,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const {
    products,
    categories,
    siteSettings,
    addProduct,
    updateProduct,
    deleteProduct,
    showToast,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [price, setPrice] = useState<number>(450);
  const [originalPrice, setOriginalPrice] = useState<number>(550);
  const [stock, setStock] = useState<number>(20);
  const [sku, setSku] = useState('');
  const [badge, setBadge] = useState('');
  const [weight, setWeight] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [allergens, setAllergens] = useState('');
  const [imagesText, setImagesText] = useState('');
  const [flavoursText, setFlavoursText] = useState('');
  const [isEggless, setIsEggless] = useState(true);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [active, setActive] = useState(true);

  // Variants state
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  // Addons state
  const [addons, setAddons] = useState<ProductAddon[]>([]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setCategoryId(categories[0]?.id || 'brownies');
    setDescription('');
    setShortDescription('');
    setPrice(450);
    setOriginalPrice(550);
    setStock(20);
    setSku(`HCT-${Math.floor(100 + Math.random() * 900)}`);
    setBadge('');
    setWeight('450g (6 Pieces)');
    setIngredients('Belgian Dark Couverture (54%), French Cultured Butter, Organic Flour, Cane Sugar');
    setAllergens('Dairy, Wheat (Gluten)');
    setImagesText('https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80');
    setFlavoursText('Dark Chocolate, Salted Caramel, Roasted Hazelnut');
    setIsEggless(true);
    setIsGlutenFree(false);
    setFeatured(true);
    setActive(true);
    setVariants([
      { id: 'v1', name: 'Box of 6 (Classic)', sku: 'HCT-VAR-1', price: 450, stock: 25, inStock: true },
      { id: 'v2', name: 'Box of 12 (Celebration)', sku: 'HCT-VAR-2', price: 850, stock: 20, inStock: true },
    ]);
    setAddons([
      { id: 'a1', name: 'Warm Fudge Ganache Dip (100ml)', price: 120 },
      { id: 'a2', name: 'Artisanal Gold Sparkler Candle', price: 90 },
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setSlug(product.slug);
    setCategoryId(product.categoryId);
    setDescription(product.description);
    setShortDescription(product.shortDescription || '');
    setPrice(product.price);
    setOriginalPrice(product.originalPrice || product.price);
    setStock(product.stock);
    setSku(product.sku || '');
    setBadge(product.badge || '');
    setWeight(product.weight || '');
    setIngredients(product.ingredients?.join(', ') || '');
    setAllergens(product.allergens?.join(', ') || '');
    setImagesText(product.images.join('\n'));
    setFlavoursText(product.flavours?.join(', ') || '');
    setIsEggless(product.eggless ?? true);
    setIsGlutenFree(product.glutenFree ?? false);
    setFeatured(product.featured ?? false);
    setActive(product.status === 'active');
    setVariants(product.variants || []);
    setAddons(product.addons || []);
    setIsModalOpen(true);
  };

  const handleDuplicate = (product: Product) => {
    const duplicated: Omit<Product, 'id'> = {
      ...product,
      name: `${product.name} (Copy)`,
      slug: `${product.slug}-copy-${Date.now().toString().slice(-4)}`,
      sku: `${product.sku}-CP`,
    };
    addProduct(duplicated);
    showToast('Product Duplicated', `Created a copy of ${product.name}`);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      showToast('Product Deleted', `Removed ${name} from catalog`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const images = imagesText
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean);

    if (images.length === 0) {
      images.push('https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80');
    }

    const payload: Omit<Product, 'id'> = {
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId,
      description: description.trim(),
      shortDescription: shortDescription.trim() || undefined,
      price: Number(price),
      originalPrice: Number(originalPrice) || undefined,
      stock: Number(stock),
      sku: sku.trim(),
      weight: weight.trim() || undefined,
      ingredients: ingredients.split(',').map((s) => s.trim()).filter(Boolean),
      allergens: allergens.split(',').map((s) => s.trim()).filter(Boolean),
      images,
      thumbnail: images[0],
      flavours: flavoursText.split(',').map((s) => s.trim()).filter(Boolean),
      categoryName: categories.find((c) => c.id === categoryId)?.name || 'Confections',
      prepTime: '2-4 hours fresh baked',
      lowStockThreshold: 5,
      tags: [name.toLowerCase(), categoryId],
      eggless: isEggless,
      glutenFree: isGlutenFree,
      featured,
      status: active ? 'active' : 'draft',
      badge: (badge.trim() as any) || undefined,
      rating: editingProduct?.rating || 4.9,
      reviewCount: editingProduct?.reviewCount || 1,
      variants,
      addons,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      showToast('Product Updated ✨', `${payload.name} has been updated successfully`);
    } else {
      addProduct(payload);
      showToast('Product Created 🎂', `${payload.name} has been added to catalog`);
    }

    setIsModalOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q || p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-white p-6 rounded-3xl border border-[#2D1810]/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#3E2723]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, SKU..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#23120B] hover:bg-[#C59B27] text-white text-xs font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-[#DFB15B]" />
          <span>Add New Delicacy</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#2D1810]/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#FAF7F2] text-[#3E2723]/70 uppercase text-[10px] tracking-wider border-b border-[#2D1810]/10">
                <th className="p-4">Confectionery</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Badges &amp; Diet</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D1810]/5">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=80'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-xl bg-white shrink-0 border border-[#2D1810]/10"
                      />
                      <div>
                        <p className="font-bold text-sm text-[#23120B]">{product.name}</p>
                        <p className="text-[11px] text-[#3E2723]/60">
                          SKU: {product.sku || 'N/A'} • {product.weight || 'Standard'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="capitalize font-semibold text-[#23120B]">
                      {categories.find((c) => c.id === product.categoryId)?.name || product.categoryId}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-sm text-[#23120B]">
                      {siteSettings.currencySymbol}{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-[#3E2723]/40 line-through block">
                        {siteSettings.currencySymbol}{product.originalPrice}
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <span
                      className={`font-bold ${
                        product.stock <= 5 ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {product.stock} in stock
                    </span>
                  </td>

                  <td className="p-4 space-y-1">
                    <div className="flex flex-wrap gap-1">
                      {product.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#C59B27] text-white">
                          {product.badge}
                        </span>
                      )}
                      {product.isEggless && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                          100% Eggless
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        product.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {product.active ? 'Active' : 'Draft'}
                    </span>
                  </td>

                  <td className="p-4 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="p-1.5 text-[#23120B] hover:bg-[#FAF7F2] rounded-lg transition-colors inline-block"
                      title="Edit Product"
                    >
                      <Edit2 className="w-4 h-4 text-[#C59B27]" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(product)}
                      className="p-1.5 text-[#23120B] hover:bg-[#FAF7F2] rounded-lg transition-colors inline-block"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4 text-[#3E2723]/60" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-block"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#2D1810]/15 overflow-hidden my-8 animate-in zoom-in-95">
            <div className="p-6 bg-[#23120B] text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  {editingProduct ? `Edit Delicacy: ${editingProduct.name}` : 'Add New Confectionery'}
                </h3>
                <p className="text-xs text-[#EADBC8]/70">
                  Fill in pricing, ingredients, variants, and high-resolution imagery.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-white/70 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
              {/* Section 1: Basic Info */}
              <div className="space-y-4">
                <h4 className="font-serif text-base font-bold text-[#23120B] border-b border-[#2D1810]/10 pb-2">
                  1. Delicacy Identity &amp; Classification
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#23120B] mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (!editingProduct) {
                          setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                        }
                      }}
                      placeholder="e.g. Belgian Truffle Fudge Brownie"
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#23120B] mb-1">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. belgian-truffle-fudge-brownie"
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-[#23120B] mb-1">Category *</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#23120B] mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="e.g. Best Seller, Chef's Choice"
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#23120B] mb-1">SKU Code</label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="e.g. HCT-BR-01"
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#23120B] mb-1">Short Tagline Description</label>
                  <input
                    type="text"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="e.g. Gooey Belgian 54% dark chocolate with a glossy crackled crust."
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#23120B] mb-1">Full Confectionery Narrative *</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe flavour profiles, chocolate percentage, texture, and artisanal methods..."
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>
              </div>

              {/* Section 2: Pricing & Stock */}
              <div className="space-y-4">
                <h4 className="font-serif text-base font-bold text-[#23120B] border-b border-[#2D1810]/10 pb-2">
                  2. Pricing, Portion Weight &amp; Inventory
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-bold text-[#23120B] mb-1">Selling Price ({siteSettings.currencySymbol}) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#23120B] mb-1">Original Price (Strike)</label>
                    <input
                      type="number"
                      min={0}
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#23120B] mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#23120B] mb-1">Weight / Unit</label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 500g (Pack of 6)"
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Ingredients & Dietary Flags */}
              <div className="space-y-4">
                <h4 className="font-serif text-base font-bold text-[#23120B] border-b border-[#2D1810]/10 pb-2">
                  3. Ingredients &amp; Dietary Guarantees
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[#23120B] mb-1">Ingredients (comma separated)</label>
                    <input
                      type="text"
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      placeholder="Couverture chocolate, French butter, Cocoa..."
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#23120B] mb-1">Allergens (comma separated)</label>
                    <input
                      type="text"
                      value={allergens}
                      onChange={(e) => setAllergens(e.target.value)}
                      placeholder="Dairy, Wheat, Tree nuts..."
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#23120B] mb-1">Flavour Profiles (comma separated)</label>
                  <input
                    type="text"
                    value={flavoursText}
                    onChange={(e) => setFlavoursText(e.target.value)}
                    placeholder="Intense Dark 54%, Sea Salt Caramel, Roasted Hazelnut..."
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>

                <div className="flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEggless}
                      onChange={(e) => setIsEggless(e.target.checked)}
                      className="w-4 h-4 accent-[#C59B27]"
                    />
                    <span className="font-semibold text-[#23120B]">100% Eggless Recipe</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGlutenFree}
                      onChange={(e) => setIsGlutenFree(e.target.checked)}
                      className="w-4 h-4 accent-[#C59B27]"
                    />
                    <span className="font-semibold text-[#23120B]">Gluten Free</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 accent-[#C59B27]"
                    />
                    <span className="font-semibold text-[#23120B]">Featured on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                      className="w-4 h-4 accent-[#C59B27]"
                    />
                    <span className="font-semibold text-[#23120B]">Product Active in Store</span>
                  </label>
                </div>
              </div>

              {/* Section 4: Imagery */}
              <div className="space-y-4">
                <h4 className="font-serif text-base font-bold text-[#23120B] border-b border-[#2D1810]/10 pb-2">
                  4. Photography URLs (one per line)
                </h4>
                <textarea
                  rows={3}
                  value={imagesText}
                  onChange={(e) => setImagesText(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl font-mono text-[11px] focus:outline-hidden focus:border-[#C59B27]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#2D1810]/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#23120B] hover:bg-[#C59B27] text-white font-bold rounded-xl transition-colors shadow-md"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Delicacy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
