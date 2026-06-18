/* eslint-disable react-refresh/only-export-components */

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const SplitContext = createContext();

const normalizeQuantity = (value) => {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const buildUnitPrices = (totalAmount, quantity) => {
  const qty = normalizeQuantity(quantity);
  const totalCents = Math.round((parseFloat(totalAmount) || 0) * 100);
  if (qty <= 0) {
    return [];
  }

  const baseCents = Math.round(totalCents / qty);
  return Array.from({ length: qty }, (_, index) => {
    if (index < qty - 1) {
      return baseCents / 100;
    }
    return (totalCents - baseCents * (qty - 1)) / 100;
  });
};

const normalizeUnitSplits = (item, quantity) => {
  const unitSplits = Array.isArray(item.unitSplits) ? item.unitSplits : [];
  return Array.from({ length: quantity }, (_, index) => {
    const split = unitSplits[index];
    const assignedTo = Array.isArray(split?.assignedTo)
      ? split.assignedTo
      : index === 0 && Array.isArray(item.assignedTo)
        ? item.assignedTo
        : [];
    return { assignedTo };
  });
};

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
      const quantity = normalizeQuantity(item.quantity);
      const totalAmount = parseFloat(item.totalAmount ?? item.amount ?? 0) || 0;
      if (!totalAmount) {
        return sum;
      }

      const unitPrices = buildUnitPrices(totalAmount, quantity);
      const unitSplits = normalizeUnitSplits(item, quantity);
      const itemTotal = unitSplits.reduce((unitSum, split, index) => {
        if (!split.assignedTo.includes(personId)) {
          return unitSum;
        }

        const splitCount = split.assignedTo.length || 1;
        const unitPrice = unitPrices[index] ?? 0;
        return unitSum + unitPrice / splitCount;
      }, 0);

      return sum + itemTotal;
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