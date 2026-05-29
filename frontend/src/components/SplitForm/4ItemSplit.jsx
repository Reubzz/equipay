import { useEffect, useRef, useState } from "react";
import { useSplit } from "../../context/SplitContext";
import styles from "../../scss/components/Steps.module.scss";

const Step4 = ({ nextStep, prevStep }) => {
    const { formData, updateForm } = useSplit();
    const [selectedItem, setSelectedItem] = useState(null);
    const selectorRef = useRef(null);
    const lastActiveElement = useRef(null);

    const togglePersonForItem = (itemId, personId) => {
        const updatedItems = formData.items.map((item) => {
            if (item.id === itemId) {
                const assigned = item.assignedTo || [];
                const isAssigned = assigned.includes(personId);
                return {
                    ...item,
                    assignedTo: isAssigned
                        ? assigned.filter((id) => id !== personId)
                        : [...assigned, personId],
                };
            }
            return item;
        });
        updateForm({ items: updatedItems });
    };

    const allPeople = [
        { id: "payer", name: "You", email: formData.payer.email },
        ...formData.people,
    ];
    const selected = formData.items.find((item) => item.id === selectedItem);

    useEffect(() => {
        if (!selectedItem) return undefined;
        const selector = selectorRef.current;
        if (!selector) return undefined;

        lastActiveElement.current = document.activeElement;

        const getFocusable = () =>
            Array.from(
                selector.querySelectorAll(
                    "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
                )
            ).filter((el) => !el.disabled);

        const focusable = getFocusable();
        if (focusable.length > 0) {
            focusable[0].focus();
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                setSelectedItem(null);
                return;
            }
            if (event.key !== "Tab") return;
            const items = getFocusable();
            if (items.length === 0) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            if (lastActiveElement.current instanceof HTMLElement) {
                lastActiveElement.current.focus();
            }
        };
    }, [selectedItem]);

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>Item Split</h2>

            <div className={styles.splitLayout}>
                <div className={styles.itemsList}>
                    <label className={styles.label}>Items</label>
                    {formData.items.map((item) => (
                        <div key={item.id} className={styles.itemRow}>
                            <span className={styles.itemName}>{item.name}</span>
                            <span className={styles.itemAmount}>{item.amount} Rs</span>
                            <button
                                type="button"
                                onClick={() => setSelectedItem(item.id)}
                                className={`${styles.btnAssign} ${selectedItem === item.id ? styles.btnAssignActive : ""
                                    }`}
                            >
                                {item.assignedTo?.length > 0
                                    ? `Assigned ${item.assignedTo.length} people`
                                    : "Assign"}
                            </button>
                        </div>
                    ))}
                </div>

                {selectedItem && (
                    <div
                        className={styles.peopleSelectorOverlay}
                        onClick={() => setSelectedItem(null)}
                    >
                        <div
                            className={styles.peopleSelector}
                            onClick={(event) => event.stopPropagation()}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="item-split-title"
                            ref={selectorRef}
                        >
                            <h3 className={styles.selectorTitle} id="item-split-title">
                                Choose for{" "}
                                {selected?.name}
                            </h3>
                            {allPeople.map((person) => {
                                const isSelected = selected?.assignedTo?.includes(person.id);
                                return (
                                    <button
                                        key={person.id}
                                        type="button"
                                        onClick={() => togglePersonForItem(selectedItem, person.id)}
                                        className={`${styles.personSelectBtn} ${isSelected ? styles.personSelectBtnActive : ""
                                            }`}
                                    >
                                        {person.name}
                                    </button>
                                );
                            })}
                            <button
                                type="button"
                                onClick={() => setSelectedItem(null)}
                                className={styles.btnConfirm}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.btnRow}>
                <button type="button" onClick={prevStep} className={styles.btnSecondary}>
                    Back
                </button>
                <button type="button" onClick={nextStep} className={styles.btnPrimary}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Step4;