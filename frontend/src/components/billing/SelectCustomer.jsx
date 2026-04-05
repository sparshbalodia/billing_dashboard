import { useAppContext } from '../../context/AppContext.jsx';

export default function SelectCustomer({ selected, onSelect }) {
  const { customers } = useAppContext();
  const active = customers.filter(c => c.is_active);

  return (
    <div>
      <p className="text-text-muted text-sm mb-5">Select a customer to proceed with billing.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {active.map(c => (
          <button
            key={c.cust_id}
            onClick={() => onSelect(c)}
            className={`text-left p-4 rounded-xl border transition-all duration-150
              ${selected?.cust_id === c.cust_id
                ? 'border-accent bg-accent/10'
                : 'border-border bg-bg-card hover:border-accent/50 hover:bg-bg-hover'
              }`}
          >
            <p className="text-text-primary font-medium text-sm mb-2">{c.name}</p>
            <p className="text-text-muted text-xs mb-1">{c.address}</p>
            <p className="text-text-muted text-xs">PAN: {c.pan}</p>
            {c.gst
              ? <p className="text-text-muted text-xs mt-1">GST: {c.gst}</p>
              : <p className="text-danger text-xs mt-1">Not GST Registered — 18% GST will apply</p>
            }
          </button>
        ))}
      </div>
    </div>
  );
}