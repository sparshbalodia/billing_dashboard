import { useState, useEffect } from 'react';
import { getInvoices } from '../services/invoiceService.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import InvoiceDetail from '../components/dashboard/InvoiceDetail.jsx';

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data } = await getInvoices();
      setInvoices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = invoices.filter(inv =>
    inv.invoice_id.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex gap-6 h-full">

      {/* Left — invoice list */}
      <div className="flex-1 min-w-0">
        <h1 className="text-text-primary text-xl font-semibold mb-6">Dashboard</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by Invoice ID or Customer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm mb-5 px-4 py-2.5 rounded-lg bg-bg-card border border-border text-text-primary placeholder:text-text-muted text-sm focus:border-accent transition-colors"
        />

        {/* Table */}
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-secondary border-b border-border">
                <th className="text-left px-5 py-3 text-text-muted font-medium tracking-wide text-xs uppercase">Invoice ID</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium tracking-wide text-xs uppercase">Customer</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium tracking-wide text-xs uppercase">Date</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium tracking-wide text-xs uppercase">Amount</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium tracking-wide text-xs uppercase">GST</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-muted">Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-muted">
                    {search ? 'No invoices match your search.' : 'No invoices yet. Create one from Billing.'}
                  </td>
                </tr>
              ) : (
                filtered.map(inv => (
                  <tr
                    key={inv.invoice_id}
                    className={`border-b border-border last:border-0 transition-colors cursor-pointer
                      ${selectedInvoice?.invoice_id === inv.invoice_id
                        ? 'bg-accent/10'
                        : 'hover:bg-bg-hover'
                      }`}
                    onClick={() => setSelected(inv)}
                  >
                    <td className="px-5 py-4 text-accent font-medium">{inv.invoice_id}</td>
                    <td className="px-5 py-4 text-text-primary">{inv.customer_name}</td>
                    <td className="px-5 py-4 text-text-muted">{formatDate(inv.created_at)}</td>
                    <td className="px-5 py-4 text-text-primary font-medium">{formatCurrency(inv.total)}</td>
                    <td className="px-5 py-4">
                      {inv.gst_applied ? (
                        <span className="px-2 py-0.5 rounded text-xs bg-success/10 text-success">Applied</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-xs bg-bg-hover text-text-muted">Exempt</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={e => { e.stopPropagation(); setSelected(inv); }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rightside — invoice detail panel */}
      {selectedInvoice && (
        <div className="w-80 shrink-0">
          <InvoiceDetail
            invoice={selectedInvoice}
            onClose={() => setSelected(null)}
          />
        </div>
      )}

    </div>
  );
}