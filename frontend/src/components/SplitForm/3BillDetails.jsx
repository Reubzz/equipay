import { useState, useEffect, useMemo } from "react";
import { useSplit } from "../../context/SplitContext";
import { useEnterToAdvance } from "../../hooks/useEnterToAdvance";
import styles from "../../scss/components/Steps.module.scss";

const Step3 = ({ nextStep, prevStep }) => {
    const { formData, updateForm } = useSplit();
    const [newItem, setNewItem] = useState({ name: "", quantity: "1", totalAmount: "" });
    const [editingItemId, setEditingItemId] = useState(null);
    const handleEnterAdvance = useEnterToAdvance();

    const resetItemForm = () => {
        setNewItem({ name: "", quantity: "1", totalAmount: "" });
        setEditingItemId(null);
    };

    const buildUnitSplits = (item, quantity) => {
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

    const handleSaveItem = () => {
        const quantity = parseInt(newItem.quantity, 10);
        const totalAmount = parseFloat(newItem.totalAmount);
        if (!newItem.name || Number.isNaN(quantity) || quantity < 1 || Number.isNaN(totalAmount)) {
            return;
        }

        if (editingItemId) {
            updateForm({
                items: formData.items.map((item) =>
                    item.id === editingItemId
                        ? {
                            ...item,
                            name: newItem.name.trim(),
                            quantity,
                            totalAmount,
                            splitMode: item.splitMode || "counts",
                            unitSplits: buildUnitSplits(item, quantity),
                        }
                        : item
                ),
            });
            resetItemForm();
            return;
        }

        updateForm({
            items: [
                ...formData.items,
                {
                    id: Date.now(),
                    name: newItem.name.trim(),
                    quantity,
                    totalAmount,
                    splitMode: "counts",
                    unitSplits: Array.from({ length: quantity }, () => ({ assignedTo: [] })),
                },
            ],
        });
        resetItemForm();
    };

    const startEditItem = (item) => {
        setEditingItemId(item.id);
        setNewItem({
            name: item.name || "",
            quantity: String(item.quantity ?? 1),
            totalAmount: String(item.totalAmount ?? item.amount ?? ""),
        });
    };

    const removeItem = (itemId) => {
        updateForm({ items: formData.items.filter((item) => item.id !== itemId) });
        if (editingItemId === itemId) {
            resetItemForm();
        }
    };

    const subtotal = useMemo(
        () =>
            formData.items.reduce(
                (sum, item) => sum + parseFloat(item.totalAmount ?? item.amount ?? 0),
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
                    <div className={styles.itemMeta}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemSubtext}>Qty {item.quantity ?? 1}</span>
                    </div>
                    <span className={styles.itemAmount}>
                        {(parseFloat(item.totalAmount ?? item.amount ?? 0)).toFixed(2)} Rs
                    </span>
                    <div className={styles.itemActions}>
                        <button
                            type="button"
                            onClick={() => startEditItem(item)}
                            className={styles.itemActionBtn}
                            aria-label="Edit item"
                            title="Edit"
                        >
                            <i className="fas fa-pen"></i>
                        </button>
                        <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className={`${styles.itemActionBtn} ${styles.itemActionDelete}`}
                            aria-label="Delete item"
                            title="Delete"
                        >
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
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
                    placeholder="Quantity"
                    className={`${styles.input} ${styles.quantityInput}`}
                    min="1"
                    step="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    onKeyDown={handleEnterAdvance}
                />
                <input
                    type="number"
                    placeholder="Total Amount"
                    className={styles.input}
                    value={newItem.totalAmount}
                    onChange={(e) => setNewItem({ ...newItem, totalAmount: e.target.value })}
                    onKeyDown={handleEnterAdvance}
                />
                <div className={styles.addItemActions}>
                    <button type="button" onClick={handleSaveItem} className={styles.btnAdd}>
                        {editingItemId ? "Update" : "Add"}
                    </button>
                    {editingItemId && (
                        <button type="button" onClick={resetItemForm} className={styles.btnGhost}>
                            Cancel
                        </button>
                    )}
                </div>
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