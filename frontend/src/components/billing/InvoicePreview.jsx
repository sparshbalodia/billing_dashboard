import { useState } from 'react';
import { createInvoice } from '../../services/invoiceService.js';
import { formatCurrency } from '../../utils/formatters.js';
import { useNavigate } from 'react-router-dom';

export default function InvoicePreview({ customer, selectedItems, onBack, onDone }) {
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);
  const navigate = useNavigate();

  const isGstRegistered = !!customer.gst;
  const subtotal = selectedItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const gstAmount = isGstRegistered ? 0 : subtotal * 0.18;
  const total = subtotal + gstAmount;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const { data } = await createInvoice({
        customer_id: customer.cust_id,
        items: selectedItems.map(i => ({
          item_id: i.item_id,
          quantity: i.quantity,
          unit_price: i.unit_price,
        })),
      });
      setCreated(data.invoice_id);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (created) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center text-success text-2xl">
          ✓
        </div>
        <h2 className="text-text-primary font-semibold text-lg">Invoice Created</h2>
        <p className="text-text-muted text-sm">
          Invoice <span className="text-accent font-medium">{created}</span> has been generated.
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={onDone}
            className="px-5 py-2.5 text-sm border border-border text-text-muted hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors"
          >
            New Invoice
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 text-sm bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
          >
            View in Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <p className="text-text-muted text-sm mb-5">Review the invoice before confirming.</p>

      <div className="bg-bg-card border border-border rounded-xl overflow-hidden mb-5">

        {/* Customer section */}
        <div className="px-5 py-4 border-b border-border">
          <p className="text-text-muted text-xs uppercase tracking-wide mb-2">Customer</p>
          <p className="text-text-primary font-medium text-sm">{customer.name}</p>
          <p className="text-text-muted text-xs mt-0.5">{customer.address}</p>
          <p className="text-text-muted text-xs mt-0.5">PAN: {customer.pan}</p>
          {customer.gst && <p className="text-text-muted text-xs mt-0.5">GST: {customer.gst}</p>}
        </div>

        {/* Items section */}
        <div className="px-5 py-4 border-b border-border">
          <p className="text-text-muted text-xs uppercase tracking-wide mb-3">Items</p>
          <div className="flex flex-col gap-2">
            {selectedItems.map(it => (
              <div key={it.item_id} className="flex justify-between items-center">
                <div>
                  <p className="text-text-primary text-sm">{it.name}</p>
                  <p className="text-text-muted text-xs">
                    {formatCurrency(it.unit_price)} × {it.quantity}
                  </p>
                </div>
                <p className="text-text-primary text-sm font-medium">
                  {formatCurrency(it.unit_price * it.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="px-5 py-4 flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Subtotal</span>
            <span className="text-text-primary">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">
              GST (18%) {isGstRegistered &&
                <span className="text-xs text-success ml-1">— Exempt</span>}
            </span>
            <span className={isGstRegistered ? 'text-text-muted line-through' : 'text-text-primary'}>
              {formatCurrency(gstAmount === 0 ? subtotal * 0.18 : gstAmount)}
            </span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t border-border mt-1">
            <span className="text-text-primary">Total</span>
            <span className="text-accent text-base">{formatCurrency(total)}</span>
          </div>
        </div>

      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-2.5 text-sm border border-border text-text-muted hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="px-5 py-2.5 text-sm bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Confirm & Generate Invoice'}
        </button>
      </div>
    </div>
  );
}