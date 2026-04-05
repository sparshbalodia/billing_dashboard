import { useState, useEffect } from 'react';
import { getInvoiceById } from '../../services/invoiceService.js';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

export default function InvoiceDetail({ invoice, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [invoice.invoice_id]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const { data } = await getInvoiceById(invoice.invoice_id);
      setDetail(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 sticky top-0">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-text-primary font-semibold text-sm">Invoice Details</h2>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary text-lg leading-none transition-colors"
        >
          ×
        </button>
      </div>

      {loading ? (
        <p className="text-text-muted text-sm text-center py-8">Loading...</p>
      ) : detail ? (
        <div className="flex flex-col gap-4">

          {/* Invoice ID */}
          <div className="bg-bg-secondary rounded-lg px-4 py-3">
            <p className="text-text-muted text-xs mb-1">Invoice ID</p>
            <p className="text-accent font-semibold text-sm">{detail.invoice_id}</p>
          </div>

          {/* Customer */}
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wide mb-2">Customer</p>
            <p className="text-text-primary font-medium text-sm">{detail.customer_name}</p>
            <p className="text-text-muted text-xs mt-0.5">{detail.address}</p>
            {detail.pan && <p className="text-text-muted text-xs mt-0.5">PAN: {detail.pan}</p>}
            {detail.gst && <p className="text-text-muted text-xs mt-0.5">GST: {detail.gst}</p>}
          </div>

          <div className="border-t border-border" />

          {/* Items */}
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wide mb-3">Items</p>
            <div className="flex flex-col gap-2">
              {detail.items.map(it => (
                <div key={it.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-text-primary text-sm">{it.item_name}</p>
                    <p className="text-text-muted text-xs">Qty: {it.quantity}</p>
                  </div>
                  <p className="text-text-primary text-sm font-medium">
                    {formatCurrency(it.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Totals */}
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Subtotal</span>
              <span className="text-text-primary">{formatCurrency(detail.subtotal)}</span>
            </div>
            {detail.gst_applied && (
              <div className="flex justify-between">
                <span className="text-text-muted">GST (18%)</span>
                <span className="text-text-primary">{formatCurrency(detail.gst_amount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold mt-1 pt-2 border-t border-border">
              <span className="text-text-primary">Total</span>
              <span className="text-accent text-base">{formatCurrency(detail.total)}</span>
            </div>
          </div>

          {/* Date */}
          <p className="text-text-muted text-xs text-right">{formatDate(detail.created_at)}</p>

        </div>
      ) : (
        <p className="text-text-muted text-sm text-center py-8">Failed to load.</p>
      )}

    </div>
  );
}