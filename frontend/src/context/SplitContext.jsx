/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect } from "react";

const SplitContext = createContext();

export const SplitProvider = ({ children }) => {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("splitFormData");
    return saved
      ? JSON.parse(saved)
      : {
          title: "",
          date: "",
          time: "",
          payer: { name: "", email: "" },
          people: [],
          items: [],
          tax: 0,
          tip: 0,
          taxSplit: "equal",
          tipSplit: "equal",
          totalAmount: 0,
        };
  });

  const updateForm = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  // Persist data in localStorage
  useEffect(() => {
    localStorage.setItem("splitFormData", JSON.stringify(formData));
  }, [formData]);

  return (
    <SplitContext.Provider value={{ formData, updateForm }}>
      {children}
    </SplitContext.Provider>
  );
};

// Custom hook
export const useSplit = () => useContext(SplitContext);
