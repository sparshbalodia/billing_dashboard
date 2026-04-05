import { useState } from 'react';
import SelectCustomer from '../components/billing/SelectCustomer.jsx';
import SelectItems from '../components/billing/SelectItems.jsx';
import InvoicePreview from '../components/billing/InvoicePreview.jsx';

const STEPS = ['Select Customer', 'Select Items', 'Preview & Confirm'];

export default function Billing() {
  const [step, setStep]= useState(0);
  const [customer, setCustomer] = useState(null);
  const [selectedItems, setItems]= useState([]);

  const handleReset= ()=> {
    setStep(0);
    setCustomer(null);
    setItems([]);
  };

  return (
    <div>
      <h1 className="text-text-primary text-xl font-semibold mb-6">Billing</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all
                ${i < step  ? 'bg-success text-white' :
                  i === step ? 'bg-accent text-white' :
                               'bg-bg-card border border-border text-text-muted'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-sm ${i === step ? 'text-text-primary font-medium' : 'text-text-muted'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-12 h-px mx-3 ${i < step ? 'bg-success' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Steps */}
      {step === 0 && (
        <SelectCustomer
          selected={customer}
          onSelect={c => { setCustomer(c); setStep(1); }}
        />
      )}
      {step === 1 && (
        <SelectItems
          selectedItems={selectedItems}
          onChange={setItems}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <InvoicePreview
          customer={customer}
          selectedItems={selectedItems}
          onBack={() => setStep(1)}
          onDone={handleReset}
        />
      )}
    </div>
  );
}