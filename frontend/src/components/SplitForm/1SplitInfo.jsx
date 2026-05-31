// import { useState } from "react";
import { useSplit } from "../../context/SplitContext";
import { useEnterToAdvance } from "../../hooks/useEnterToAdvance";
import styles from "../../scss/components/Steps.module.scss";

const Step1SplitInfo = ({ nextStep }) => {
  const { formData, updateForm } = useSplit();
  const handleEnterAdvance = useEnterToAdvance();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time) {
      return;
    }

    if (!formData.title || !formData.title.trim()) {
      updateForm({ title: "quick split" });
    }

    nextStep();
  };

  return (
    <div className={styles.card} data-enter-scope="true">
      <h2 className={styles.title}>Split Information</h2>
      <form onSubmit={handleSubmit}>
        <label className={styles.label}>Title</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Jackson's Restaurant Split"
          value={formData.title}
          onChange={(e) => updateForm({ title: e.target.value })}
          onKeyDown={handleEnterAdvance}
        />

        <label className={styles.label}>Date & Time</label>
        <div className={styles.dateTimeRow}>
          <input
            type="date"
            className={styles.input}
            value={formData.date}
            onChange={(e) => updateForm({ date: e.target.value })}
            onKeyDown={handleEnterAdvance}
            required
          />
          <input
            type="time"
            className={styles.input}
            value={formData.time}
            onChange={(e) => updateForm({ time: e.target.value })}
            onKeyDown={handleEnterAdvance}
            required
          />
        </div>

        <button type="submit" className={styles.btnPrimary}>
          Next
        </button>
      </form>
    </div>
  );
};

export default Step1SplitInfo;
