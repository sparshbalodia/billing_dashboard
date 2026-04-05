import { useAppContext } from '../../context/AppContext.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export default function SelectItems({ selectedItems, onChange, onBack, onNext }) {
  const { items } = useAppContext();
  const active = items.filter(it => it.is_active);

  const getQty = (id) => {
    const found = selectedItems.find(i => i.item_id === id);
    return found ? found.quantity : 0;
  };

  const updateQty = (item, qty) => {
    if (qty <= 0) {
      onChange(selectedItems.filter(i => i.item_id !== item.item_id));
    } else {
      const exists = selectedItems.find(i => i.item_id === item.item_id);
      if (exists) {
        onChange(selectedItems.map(i =>
          i.item_id === item.item_id ? { ...i, quantity: qty } : i
        ));
      } else {
        onChange([...selectedItems, {
          item_id: item.item_id,
          name: item.name,
          unit_price: parseFloat(item.price),
          quantity: qty,
        }]);
      }
    }
  };

  const total = selectedItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const hasItems = selectedItems.length > 0;

  return (
    <div>
      <p className="text-text-muted text-sm mb-5">Add items and set quantities.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {active.map(it => {
          const qty = getQty(it.item_id);
          return (
            <div key={it.item_id}
              className={`bg-bg-card border rounded-xl p-4 transition-all
                ${qty > 0 ? 'border-accent' : 'border-border'}`}>
              <p className="text-text-primary font-medium text-sm mb-1">{it.name}</p>
              <p className="text-accent font-semibold mb-3">{formatCurrency(it.price)}</p>

              {/* Quantity control */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQty(it, qty - 1)}
                  disabled={qty === 0}
                  className="w-7 h-7 rounded-full border border-border bg-bg-secondary text-text-primary hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-base leading-none flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-text-primary font-medium text-sm w-4 text-center">{qty}</span>
                <button
                  onClick={() => updateQty(it, qty + 1)}
                  className="w-7 h-7 rounded-full border border-border bg-bg-secondary text-text-primary hover:bg-bg-hover transition-colors text-base leading-none flex items-center justify-center"
                >
                  +
                </button>
                {qty > 0 && (
                  <span className="text-text-muted text-xs ml-auto">
                    {formatCurrency(it.price * qty)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary bar */}
      {hasItems && (
        <div className="bg-bg-card border border-border rounded-xl px-5 py-3 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-text-muted text-sm">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <span className="text-accent font-semibold">{formatCurrency(total)}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-2.5 text-sm border border-border text-text-muted hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!hasItems}
          className="px-5 py-2.5 text-sm bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}