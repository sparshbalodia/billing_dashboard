import { NavLink } from 'react-router-dom';
import { useState } from 'react'
import { useEffect } from 'react';

const links = [
  {
    to: '/dashboard',
    label: 'Dashboard', 
    icon: <i className="ri-dashboard-fill text-lg" />,
  },
  {
    to: '/master',
    label: 'Master',
    icon: <i className="ri-user-line text-lg" />
  },
  {
    to: '/billing',
    label: 'Billing',
    icon: <i className="ri-archive-stack-line text-lg" />
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(()=> window.innerWidth >= 768);

  useEffect(()=> {
    const handleResize = () => {
      if(window.innerWidth >= 768) return;
        setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside
      className={`flex flex-col shrink-0 bg-bg-secondary border-r border-border transition-all duration-300 
      ${isOpen ? 'w-52' : 'w-16'}`}
    >

      {/* Logo */}
      <div className="px-3 py-4 border-b border-border flex items-center justify-between">
        {isOpen && (
          <div>
            <span className="block text-text-primary font-semibold text-sm">
              Billing Dashboard
            </span>
            <span className="text-text-muted text-[10px] uppercase">
              By Sparsh
            </span>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? 'Collapse' : 'Expand'}
          className="p-2 rounded-md hover:bg-bg-hover text-text-muted hover:text-text-primary"
        >
          <i
            className={`text-lg ${
              isOpen ? 'ri-menu-fold-line' : 'ri-menu-unfold-line'
            }`}
          />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            title={!isOpen ? label : ''} 
            className={({ isActive }) =>
              `flex items-center ${isOpen ? 'gap-3' : 'justify-center' }  px-3 py-2.5 rounded-lg text-sm transition-all duration-150
              ${isActive
                ? 'bg-accent text-white font-medium'
                : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
              }`
            }
          >
            {icon}
            {isOpen && label}
          </NavLink>
        ))}
      </nav>

      <div className='border-t border-border p-2'>
        <NavLink
          to="/settings"
          title={!isOpen ? 'Settings' : ''}
          className={({ isActive }) =>
            `flex items-center ${isOpen ? 'gap-3' : 'justify-center'} px-3 py-2.5 rounded-lg text-sm transition-all duration-150
            ${isActive
              ? 'bg-accent text-white font-medium'
              : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
            }`
          }
        >
          <i className='ri-settings-line text-lg'/>
          {isOpen && 'Settings'}
        </NavLink>
      </div>

    </aside>
  );
}