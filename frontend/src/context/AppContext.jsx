import { createContext, useContext, useState, useEffect } from 'react';
import { getCustomers } from '../services/customerService.js';
import { getItems } from '../services/itemService.js';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);

  const fetchCustomers = async () => {
    const { data } = await getCustomers();
    setCustomers(data);
  };

  const fetchItems = async () => {
    const { data } = await getItems();
    setItems(data);
  };

  useEffect(() => {
    fetchCustomers();
    fetchItems();
  }, []);

  return (
    <AppContext.Provider value={{ customers, items, fetchCustomers, fetchItems }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);