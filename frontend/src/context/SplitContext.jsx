/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState } from "react";

const SplitContext = createContext();

export const SplitProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    payer: { name: "You", email: "test@reubz.io" },
    people: [],
    items: [],
    tax: 0,
    tip: 0,
    taxSplit: "proportional",
    tipSplit: "equal",
    totalAmount: 0,
    subtotal: 0,
  });

  const updateForm = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const calculatePersonAmount = (personId) => {
    const itemsTotal = formData.items
      .filter((item) => item.assignedTo?.includes(personId))
      .reduce((sum, item) => {
        const splitCount = item.assignedTo.length || 1;
        return sum + parseFloat(item.amount || 0) / splitCount;
      }, 0);

    const subtotal = parseFloat(formData.subtotal) || 0;
    const tax = parseFloat(formData.tax) || 0;
    const tip = parseFloat(formData.tip) || 0;
    const peopleCount = formData.people.length + 1; 

    let taxPerPerson = 0;
    if (formData.taxSplit === "equal") {
      taxPerPerson = tax / peopleCount;
    } else {
      if (subtotal > 0) {
        taxPerPerson = (itemsTotal / subtotal) * tax;
      }
    }

    let tipPerPerson = 0;
    if (formData.tipSplit === "equal") {
      tipPerPerson = tip / peopleCount;
    } else {
      if (subtotal > 0) {
        tipPerPerson = (itemsTotal / subtotal) * tip;
      }
    }

    return itemsTotal + taxPerPerson + tipPerPerson;
  };

  return (
    <SplitContext.Provider
      value={{ formData, updateForm, calculatePersonAmount }}
    >
      {children}
    </SplitContext.Provider>
  );
};

export const useSplit = () => useContext(SplitContext);