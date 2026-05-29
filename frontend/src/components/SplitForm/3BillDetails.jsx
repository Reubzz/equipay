import { useState, useEffect, useMemo } from "react";
import { useSplit } from "../../context/SplitContext";
import { useEnterToAdvance } from "../../hooks/useEnterToAdvance";
import styles from "../../scss/components/Steps.module.scss";

const Step3 = ({ nextStep, prevStep }) => {
    const { formData, updateForm } = useSplit();
    const [newItem, setNewItem] = useState({ name: "", amount: "" });
    const handleEnterAdvance = useEnterToAdvance();

    const addItem = () => {
        if (newItem.name && newItem.amount) {
            updateForm({
                items: [...formData.items, { ...newItem, id: Date.now(), assignedTo: [] }],
            });
            setNewItem({ name: "", amount: "" });
        }
    };

    const subtotal = useMemo(
        () =>
            formData.items.reduce(
                (sum, item) => sum + parseFloat(item.amount || 0),
                0
            ),
        [formData.items]
    );
    const total = useMemo(
        () => subtotal + parseFloat(formData.tax || 0) + parseFloat(formData.tip || 0),
        [subtotal, formData.tax, formData.tip]
    );
    
    useEffect(() => {
        updateForm({ subtotal });
    }, [subtotal, updateForm]);
    
    const handleNext = () => {
        updateForm({ 
            subtotal,
            totalAmount: total 
        });
        nextStep();
    };
    return (
        <div className={styles.card} data-enter-scope="true">
            <h2 className={styles.title}>Add Bill Details</h2>

            <label className={styles.label}>Upload Bill</label>
            <div className={styles.uploadArea}>
                <span>Upload Image here</span>
                <button type="button" className={styles.btnUpload}>
                    Choose File
                </button>
            </div>

            <label className={styles.label}>Manual Entry</label>
            {formData.items.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemAmount}>{item.amount} Rs</span>
                </div>
            ))}

            <div className={styles.addItemRow}>
                <input
                    type="text"
                    placeholder="Item Name"
                    className={styles.input}
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    onKeyDown={handleEnterAdvance}
                />
                <input
                    type="number"
                    placeholder="Amount"
                    className={styles.input}
                    value={newItem.amount}
                    onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                    onKeyDown={handleEnterAdvance}
                />
                <button type="button" onClick={addItem} className={styles.btnAdd}>
                    Add
                </button>
            </div>

            <div className={styles.totalSection}>
                <div className={styles.totalRow}>
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)} Rs</span>
                </div>

                <div className={styles.taxTipRow}>
                    <div className={styles.taxTipItem}>
                        <p>Tax</p>
                        <input
                            type="number"
                            placeholder="Tax"
                            className={styles.input}
                            value={formData.tax}
                            onChange={(e) => updateForm({ tax: e.target.value })}
                            onKeyDown={handleEnterAdvance}
                            />
                        {/* <button type="button" className={styles.btnSmall}>
                                Add
                                </button> */}
                    </div>
                    <div className={styles.taxTipItem}>
                        <p>Tip</p>
                        <input
                            type="number"
                            placeholder="Tip"
                            className={styles.input}
                            value={formData.tip}
                            onChange={(e) => updateForm({ tip: e.target.value })}
                            onKeyDown={handleEnterAdvance}
                        />
                        {/* <button type="button" className={styles.btnSmall}>
                                Add
                        </button> */}
                    </div>
                </div>

                <div className={styles.totalRow}>
                    <span>Total Amount</span>
                    <span>{total.toFixed(2)} Rs</span>
                </div>
            </div>

            <div className={styles.btnRow}>
                <button type="button" onClick={prevStep} className={styles.btnSecondary}>
                    Back
                </button>
                <button type="button" onClick={handleNext} className={styles.btnPrimary} disabled={formData.items.length === 0}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Step3;