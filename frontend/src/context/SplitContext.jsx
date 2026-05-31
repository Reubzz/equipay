/* eslint-disable react-refresh/only-export-components */

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const SplitContext = createContext();

export const SplitProvider = ({ children }) => {
  const getDefaultDateTime = () => {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");
    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )}`;
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    return { date, time };
  };

  const [formData, setFormData] = useState(() => {
    const { date: defaultDate, time: defaultTime } = getDefaultDateTime();
    return {
      title: "",
      date: defaultDate,
      time: defaultTime,
      payer: { name: "You", email: "" },
      people: [],
      items: [],
      tax: 0,
      tip: 0,
      taxSplit: "proportional",
      tipSplit: "equal",
      totalAmount: 0,
      subtotal: 0,
    };
  });

  const updateForm = useCallback((newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  }, []);

  const calculatePersonAmount = useCallback((personId) => {
    const itemsTotal = formData.items.reduce((sum, item) => {
      const assignedTo = Array.isArray(item.assignedTo) ? item.assignedTo : [];
      if (!assignedTo.includes(personId)) {
        return sum;
      }

      const splitCount = assignedTo.length || 1;
      return sum + parseFloat(item.amount || 0) / splitCount;
    }, 0);

    const subtotal = parseFloat(formData.subtotal) || 0;
    const tax = parseFloat(formData.tax) || 0;
    const tip = parseFloat(formData.tip) || 0;
    const peopleCount = formData.people.length + 1; 

    const splitExtra = (amount, splitMode) => {
      if (amount === 0) {
        return 0;
      }

      if (splitMode === "equal") {
        return amount / peopleCount;
      }

      if (subtotal > 0) {
        return (itemsTotal / subtotal) * amount;
      }

      return 0;
    };

    const taxPerPerson = splitExtra(tax, formData.taxSplit);
    const tipPerPerson = splitExtra(tip, formData.tipSplit);

    return itemsTotal + taxPerPerson + tipPerPerson;
  }, [formData]);

  const contextValue = useMemo(
    () => ({ formData, updateForm, calculatePersonAmount }),
    [formData, updateForm, calculatePersonAmount]
  );

  return (
    <SplitContext.Provider value={contextValue}>
      {children}
    </SplitContext.Provider>
  );
};

export const useSplit = () => useContext(SplitContext);