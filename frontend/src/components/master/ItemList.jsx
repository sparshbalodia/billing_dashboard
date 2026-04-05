import { useState } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import { createItem } from '../../services/itemService.js';
import { formatCurrency } from '../../utils/formatters.js';
import Modal from '../common/Modal.jsx';

export default function ItemList() {
  const { items, fetchItems } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [form, setForm] = useState({ name: '', price: '', is_active: true });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) return alert('Name and price are required.');
    setLoading(true);
    try {
      await createItem({ ...form, price: parseFloat(form.price) });
      await fetchItems();
      setShowModal(false);
      setForm({ name: '', price: '', is_active: true });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-text-muted text-sm">{items.length} items</p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm rounded-lg transition-colors"
        >
          <span className="text-base leading-none">+</span> Add Item
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(it => (
          <div key={it.item_id} className="bg-bg-card border border-border rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <p className="text-text-primary font-medium text-sm">{it.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded shrink-0 font-medium
                ${it.is_active
                  ? 'bg-success/10 text-success'
                  : 'bg-danger/10 text-danger'
                }`}>
                {it.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-accent font-semibold text-base">{formatCurrency(it.price)}</p>
            <p className="text-text-muted text-xs mt-1">{it.item_id}</p>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      <Modal
        title="Add New Item"
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleSubmit}
        confirmLabel={loading ? 'Creating...' : 'Create'}
        loading={loading}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-text-muted text-xs mb-1.5">Item Name *</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. Laptop"
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:border-accent transition-colors" />
          </div>
          <div>
            <label className="block text-text-muted text-xs mb-1.5">Selling Price *</label>
            <input name="price" type="number" value={form.price} onChange={handleChange}
              placeholder="e.g. 85000"
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:border-accent transition-colors" />
          </div>
          <div>
            <label className="block text-text-muted text-xs mb-1.5">Status</label>
            <select name="is_active" value={form.is_active} onChange={handleChange}
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm focus:border-accent transition-colors">
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}