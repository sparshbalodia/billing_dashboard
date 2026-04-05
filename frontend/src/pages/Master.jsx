import { useState } from 'react';
import CustomerList from '../components/master/CustomerList.jsx';
import ItemList from '../components/master/ItemList.jsx';

export default function Master() {
  const [tab, setTab] = useState('customers');

  return (
    <div>
      <h1 className="text-text-primary text-xl font-semibold mb-6">Master</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-secondary border border-border rounded-lg p-1 w-fit mb-6">
        {['customers', 'items'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-md text-sm font-medium capitalize transition-all duration-150
              ${tab === t
                ? 'bg-accent text-white'
                : 'text-text-muted hover:text-text-primary'
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'customers' ? <CustomerList /> : <ItemList />}
    </div>
  );
}