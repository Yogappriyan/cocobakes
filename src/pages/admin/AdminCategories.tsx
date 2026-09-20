import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import { Plus, Edit2, Trash2, X, Layers, Image as ImageIcon } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, setCategories, products, showToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImage(cat.image);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, catName: string) => {
    const productsInCat = products.filter((p) => p.categoryId === id);
    if (productsInCat.length > 0) {
      alert(`Cannot delete "${catName}" because it has ${productsInCat.length} products assigned to it.`);
      return;
    }
    if (window.confirm(`Delete category "${catName}"?`)) {
      setCategories(categories.filter((c) => c.id !== id));
      showToast('Category Deleted', `Removed "${catName}"`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name, slug, description, image }
            : c
        )
      );
      showToast('Category Updated', `Updated category "${name}"`);
    } else {
      const newCat: Category = {
        id: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        image,
        productCount: 0,
        displayOrder: categories.length + 1,
        status: 'active',
      };
      setCategories([...categories, newCat]);
      showToast('Category Created', `Created category "${name}"`);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#2D1810]/10 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#23120B]">
            Collection Categories ({categories.length})
          </h3>
          <p className="text-xs text-[#3E2723]/60">
            Manage your confectionery department hierarchy and display imagery.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-[#23120B] hover:bg-[#C59B27] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-[#DFB15B]" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const count = products.filter((p) => p.categoryId === category.id).length;
          return (
            <div
              key={category.id}
              className="bg-white rounded-3xl border border-[#2D1810]/10 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/9 bg-[#FAF7F2]">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#23120B]/80 text-white backdrop-blur-xs">
                    {count} products
                  </span>
                </div>

                <div className="p-5">
                  <h4 className="font-serif text-lg font-bold text-[#23120B]">
                    {category.name}
                  </h4>
                  <p className="text-xs text-[#3E2723]/60 mt-1 font-mono">
                    /{category.slug}
                  </p>
                  {category.description && (
                    <p className="text-xs text-[#3E2723]/80 mt-2 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-[#FAF7F2] border-t border-[#2D1810]/10 flex justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(category)}
                  className="p-2 text-[#23120B] hover:bg-white rounded-lg transition-colors"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4 text-[#C59B27]" />
                </button>
                <button
                  onClick={() => handleDelete(category.id, category.name)}
                  className="p-2 text-rose-600 hover:bg-white rounded-lg transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#2D1810]/15 overflow-hidden animate-in zoom-in-95">
            <div className="p-5 bg-[#23120B] text-white flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#23120B] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Belgian Brownies"
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#23120B] mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. belgian-brownies"
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#23120B] mb-1">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#23120B] mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief narrative about this dessert department..."
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#23120B] hover:bg-[#C59B27] text-white font-bold rounded-xl"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
