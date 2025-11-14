import { useState } from "react";
import { useSplit } from "../../context/SplitContext";
import styles from "../../scss/components/Steps.module.scss";

const Step4 = ({ nextStep, prevStep }) => {
    const { formData, updateForm } = useSplit();
    const [selectedItem, setSelectedItem] = useState(null);

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
                    <div className={styles.peopleSelector}>
                        <h3 className={styles.selectorTitle}>
                            Choose for{" "}
                            {formData.items.find((i) => i.id === selectedItem)?.name}
                        </h3>
                        {allPeople.map((person) => {
                            const item = formData.items.find((i) => i.id === selectedItem);
                            const isSelected = item?.assignedTo?.includes(person.id);
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