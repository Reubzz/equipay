import { useEffect, useRef, useState } from "react";
import { useSplit } from "../../context/SplitContext";
import styles from "../../scss/components/Steps.module.scss";

const Step4 = ({ nextStep, prevStep }) => {
    const { formData, updateForm } = useSplit();
    const [selectedItem, setSelectedItem] = useState(null);
    const selectorRef = useRef(null);
    const lastActiveElement = useRef(null);

    const normalizeQuantity = (value) => {
        const parsed = parseInt(value, 10);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
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

    const updateItem = (itemId, updater) => {
        const updatedItems = formData.items.map((item) =>
            item.id === itemId ? updater(item) : item
        );
        updateForm({ items: updatedItems });
    };

    const buildSplitsForCounts = (item, quantity) => {
        const unitSplits = normalizeUnitSplits(item, quantity);
        const counts = getUnitCounts(unitSplits, allPeople);
        return buildUnitSplitsFromCounts(counts, quantity, allPeople);
    };

    const buildSplitsForUnits = (item, quantity) => {
        const unitSplits = normalizeUnitSplits(item, quantity);
        const counts = getUnitCounts(unitSplits, allPeople);
        return buildUnitSplitsFromCounts(counts, quantity, allPeople);
    };

    const updateSplitMode = (itemId, splitMode) => {
        updateItem(itemId, (item) => {
            if (item.splitMode === splitMode) {
                return item;
            }

            const quantity = normalizeQuantity(item.quantity);
            if (splitMode === "counts") {
                return {
                    ...item,
                    splitMode,
                    unitSplits: buildSplitsForCounts(item, quantity),
                };
            }

            if (item.splitMode === "counts") {
                return {
                    ...item,
                    splitMode: "units",
                    unitSplits: buildSplitsForUnits(item, quantity),
                };
            }

            return { ...item, splitMode: "units" };
        });
    };

    const setAllUnitsAssigned = (itemId, assignAll) => {
        updateItem(itemId, (item) => {
            const quantity = normalizeQuantity(item.quantity);
            const assignedTo = assignAll ? allPeople.map((person) => person.id) : [];
            const unitSplits = Array.from({ length: quantity }, () => ({ assignedTo }));
            return { ...item, splitMode: "units", unitSplits };
        });
    };

    const getUnitCounts = (unitSplits, people) => {
        const counts = Object.fromEntries(people.map((person) => [person.id, 0]));
        unitSplits.forEach((split) => {
            if (Array.isArray(split.assignedTo) && split.assignedTo.length === 1) {
                const personId = split.assignedTo[0];
                if (counts[personId] !== undefined) {
                    counts[personId] += 1;
                }
            }
        });
        return counts;
    };

    const buildUnitSplitsFromCounts = (counts, quantity, people) => {
        const unitSplits = [];
        people.forEach((person) => {
            const count = counts[person.id] || 0;
            for (let i = 0; i < count; i += 1) {
                unitSplits.push({ assignedTo: [person.id] });
            }
        });
        while (unitSplits.length < quantity) {
            unitSplits.push({ assignedTo: [] });
        }
        return unitSplits.slice(0, quantity);
    };

    const adjustUnitCount = (itemId, personId, delta) => {
        updateItem(itemId, (item) => {
            const quantity = normalizeQuantity(item.quantity);
            const unitSplits = normalizeUnitSplits(item, quantity);
            const counts = getUnitCounts(unitSplits, allPeople);
            const currentCount = counts[personId] || 0;
            const totalAssigned = Object.values(counts).reduce(
                (sum, count) => sum + count,
                0
            );
            if (delta > 0 && totalAssigned >= quantity) {
                return item;
            }

            const nextCount = Math.max(0, currentCount + delta);
            counts[personId] = nextCount;
            const nextSplits = buildUnitSplitsFromCounts(counts, quantity, allPeople);
            return { ...item, splitMode: "counts", unitSplits: nextSplits };
        });
    };

    const togglePersonForUnit = (itemId, unitIndex, personId) => {
        updateItem(itemId, (item) => {
            const quantity = normalizeQuantity(item.quantity);
            const unitSplits = normalizeUnitSplits(item, quantity);
            if (!unitSplits[unitIndex]) {
                return item;
            }

            const assignedSet = new Set(unitSplits[unitIndex].assignedTo || []);
            if (assignedSet.has(personId)) {
                assignedSet.delete(personId);
            } else {
                assignedSet.add(personId);
            }

            const nextSplits = unitSplits.map((split, index) =>
                index === unitIndex
                    ? { assignedTo: Array.from(assignedSet) }
                    : split
            );
            return { ...item, unitSplits: nextSplits };
        });
    };

    const allPeople = [
        { id: "payer", name: "You", email: formData.payer.email },
        ...formData.people,
    ];
    const selected = formData.items.find((item) => item.id === selectedItem);
    const selectedQuantity = selected ? normalizeQuantity(selected.quantity) : 0;
    const selectedUnitSplits = selected
        ? normalizeUnitSplits(selected, selectedQuantity)
        : [];
    const selectedSplitMode = selected?.splitMode || "counts";
    const selectedCounts = selected
        ? getUnitCounts(selectedUnitSplits, allPeople)
        : {};
    const isEqualSplit =
        selectedUnitSplits.length > 0 &&
        selectedUnitSplits.every((split) =>
            split.assignedTo.length === allPeople.length &&
            allPeople.every((person) => split.assignedTo.includes(person.id))
        );
    const selectedAssigned = selectedUnitSplits.filter(
        (split) => split.assignedTo.length > 0
    ).length;
    const selectedRemaining = Math.max(0, selectedQuantity - selectedAssigned);

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
                            <div className={styles.itemMeta}>
                                <span className={styles.itemName}>{item.name}</span>
                                <span className={styles.itemSubtext}>
                                    Qty {normalizeQuantity(item.quantity)}
                                </span>
                            </div>
                            <span className={styles.itemAmount}>
                                {parseFloat(item.totalAmount ?? item.amount ?? 0).toFixed(2)} Rs
                            </span>
                            <button
                                type="button"
                                onClick={() => setSelectedItem(item.id)}
                                className={`${styles.btnAssign} ${selectedItem === item.id ? styles.btnAssignActive : ""
                                    }`}
                            >
                                {(() => {
                                    const quantity = normalizeQuantity(item.quantity);
                                    const unitSplits = normalizeUnitSplits(item, quantity);
                                    const assignedCount = unitSplits.filter(
                                        (split) => split.assignedTo.length > 0
                                    ).length;
                                    return assignedCount > 0
                                        ? `Assigned ${assignedCount}/${quantity} units`
                                        : "Assign";
                                })()}
                            </button>
                        </div>
                    ))}
                </div>

                {selectedItem && selected && (
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
                            <div className={styles.peopleSelectorHeader}>
                                <h3 className={styles.selectorTitle} id="item-split-title">
                                    Choose for{" "}
                                    {selected?.name}
                                </h3>
                            </div>
                            <div className={styles.peopleSelectorBody}>
                                <div className={styles.splitModeRow}>
                                    <div className={styles.toggleBtnGroup}>
                                        <button
                                            type="button"
                                            className={`${styles.toggleBtn} ${selectedSplitMode === "counts" ? styles.toggleBtnActive : ""
                                                }`}
                                            aria-pressed={selectedSplitMode === "counts"}
                                            onClick={() => updateSplitMode(selectedItem, "counts")}
                                        >
                                            Counts per person
                                        </button>
                                        <button
                                            type="button"
                                            className={`${styles.toggleBtn} ${selectedSplitMode === "units" ? styles.toggleBtnActive : ""
                                                }`}
                                            aria-pressed={selectedSplitMode === "units"}
                                            onClick={() => updateSplitMode(selectedItem, "units")}
                                        >
                                            Explicit units
                                        </button>
                                    </div>
                                    <div className={styles.splitModeMeta}>
                                        {selectedAssigned}/{selectedQuantity} units assigned
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.splitQuickBtn}
                                        onClick={() =>
                                            setAllUnitsAssigned(selectedItem, !isEqualSplit)
                                        }
                                    >
                                        {isEqualSplit ? "Divide individually" : "Divide equally"}
                                    </button>
                                </div>

                                {selectedSplitMode === "counts" ? (
                                    <div className={styles.countList}>
                                        {allPeople.map((person) => {
                                            const count = selectedCounts[person.id] || 0;
                                            return (
                                                <div key={person.id} className={styles.countRow}>
                                                    <span className={styles.countName}>{person.name}</span>
                                                    <div className={styles.countControls}>
                                                        <button
                                                            type="button"
                                                            className={styles.countBtn}
                                                            onClick={() => adjustUnitCount(selectedItem, person.id, -1)}
                                                            disabled={count === 0}
                                                        >
                                                            -
                                                        </button>
                                                        <span className={styles.countValue}>{count}</span>
                                                        <button
                                                            type="button"
                                                            className={styles.countBtn}
                                                            onClick={() => adjustUnitCount(selectedItem, person.id, 1)}
                                                            disabled={selectedRemaining <= 0}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div className={styles.countRemaining}>
                                            Remaining units: {selectedRemaining}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.unitGrid}>
                                        {selectedUnitSplits.map((split, index) => (
                                            <div key={`unit-${index}`} className={styles.unitCard}>
                                                <div className={styles.unitHeader}>Unit {index + 1}</div>
                                                <div className={styles.unitPeople}>
                                                    {allPeople.map((person) => {
                                                        const isSelected = split.assignedTo.includes(person.id);
                                                        return (
                                                            <button
                                                                key={person.id}
                                                                type="button"
                                                                onClick={() =>
                                                                    togglePersonForUnit(selectedItem, index, person.id)
                                                                }
                                                                className={`${styles.personSelectBtn} ${isSelected ? styles.personSelectBtnActive : ""
                                                                    }`}
                                                            >
                                                                {person.name}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className={styles.peopleSelectorFooter}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedItem(null)}
                                    className={styles.btnConfirm}
                                >
                                    Confirm
                                </button>
                            </div>
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