import { useState } from "react";
import { useSplit } from "../../context/SplitContext";
import { useEnterToAdvance } from "../../hooks/useEnterToAdvance";
import styles from "../../scss/components/Steps.module.scss";

const Step2 = ({ nextStep, prevStep }) => {
    const { formData, updateForm } = useSplit();
    const [newPerson, setNewPerson] = useState({ name: "", email: "" });
    const handleEnterAdvance = useEnterToAdvance();

    const addPerson = () => {
        if (newPerson.name) {
            updateForm({
                people: [...formData.people, { ...newPerson, id: Date.now() }],
            });
            setNewPerson({ name: "", email: "" });
        }
    };

    const removePerson = (id) => {
        updateForm({
            people: formData.people.filter((p) => p.id !== id),
        });
    };

    return (
        <div className={styles.card} data-enter-scope="true">
            <h2 className={styles.title}>Add People</h2>

            <div className={styles.section}>
                <label className={styles.label}>Bill Payer</label>
                <div className={styles.personCard}>
                    <div className={styles.avatar}>
                        <i className="fas fa-user"></i>
                    </div>
                    <div className={styles.personInfo}>
                        <div className={styles.personName}>You (Payer)</div>
                        <div className={styles.personEmail}>
                            {formData.payer.email || "test@reubz.io"}
                        </div>
                    </div>
                </div>
            </div>

            <label className={styles.label}>Others</label>
            {formData.people.map((person) => (
                <div key={person.id} className={styles.personCard}>
                    <div className={styles.avatar}>
                        <i className="fas fa-user"></i>
                    </div>
                    <div className={styles.personInfo}>
                        <div className={styles.personName}>{person.name}</div>
                        <div className={styles.personEmail}>{person.email || "-"}</div>
                    </div>
                    <button
                        type="button"
                        onClick={() => removePerson(person.id)}
                        className={styles.iconBtn}
                    >
                        <i className="fas fa-trash"></i>
                    </button>
                </div>
            ))}

            <div className={styles.addPersonRow}>
                <input
                    type="text"
                    placeholder="Name"
                    className={styles.input}
                    value={newPerson.name}
                    onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                    onKeyDown={handleEnterAdvance}
                />
                <input
                    type="email"
                    placeholder="Email (optional)"
                    className={styles.input}
                    value={newPerson.email}
                    onChange={(e) =>
                        setNewPerson({ ...newPerson, email: e.target.value })
                    }
                    onKeyDown={handleEnterAdvance}
                />
                <button type="button" onClick={addPerson} className={styles.btnAdd}>
                    Add
                </button>
            </div>

            <div className={styles.btnRow}>
                <button
                    type="button"
                    onClick={prevStep}
                    className={styles.btnSecondary}
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={nextStep}
                    className={styles.btnPrimary}
                    disabled={formData.people.length === 0}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Step2;
