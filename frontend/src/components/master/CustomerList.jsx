import { useState } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import { createCustomer } from '../../services/customerService.js';
import Modal from '../common/Modal.jsx';

export default function CustomerList() {
  const { customers, fetchCustomers } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', address: '', pan: '', gst: '', is_active: true,
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.pan) return alert('Name and PAN are required.');
    setLoading(true);
    try {
      await createCustomer(form);
      await fetchCustomers();
      setShowModal(false);
      setForm({ name: '', address: '', pan: '', gst: '', is_active: true });
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
        <p className="text-text-muted text-sm">{customers.length} customers</p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm rounded-lg transition-colors"
        >
          <span className="text-base leading-none">+</span> Add Customer
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map(c => (
          <div key={c.cust_id} className="bg-bg-card border border-border rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <p className="text-text-primary font-medium text-sm leading-snug pr-2">{c.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded shrink-0 font-medium
                ${c.is_active
                  ? 'bg-success/10 text-success'
                  : 'bg-danger/10 text-danger'
                }`}>
                {c.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {c.address && <p className="text-text-muted text-xs">{c.address}</p>}
              <p className="text-text-muted text-xs">PAN: <span className="text-text-primary">{c.pan}</span></p>
              {c.gst
                ? <p className="text-text-muted text-xs">GST: <span className="text-text-primary">{c.gst}</span></p>
                : <p className="text-text-muted text-xs">GST: <span className="text-danger">Not Registered</span></p>
              }
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      <Modal
        title="Add New Customer"
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleSubmit}
        confirmLabel={loading ? 'Creating...' : 'Create'}
        loading={loading}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-text-muted text-xs mb-1.5">Customer Name *</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. Abcd Pvt. Ltd."
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:border-accent transition-colors" />
          </div>
          <div className="col-span-2">
            <label className="block text-text-muted text-xs mb-1.5">Address</label>
            <input name="address" value={form.address} onChange={handleChange}
              placeholder="City, State"
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:border-accent transition-colors" />
          </div>
          <div>
            <label className="block text-text-muted text-xs mb-1.5">PAN Number *</label>
            <input name="pan" value={form.pan} onChange={handleChange}
              placeholder="ABCDE1234F"
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:border-accent transition-colors" />
          </div>
          <div>
            <label className="block text-text-muted text-xs mb-1.5">GST Number</label>
            <input name="gst" value={form.gst} onChange={handleChange}
              placeholder="Leave blank if not registered"
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:border-accent transition-colors" />
          </div>
          <div className="col-span-2">
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