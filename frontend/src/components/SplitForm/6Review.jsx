import { useSplit } from "../../context/SplitContext";
import styles from "../../scss/components/Steps.module.scss";


const Step6 = ({ nextStep, prevStep }) => {
    const { formData, calculatePersonAmount } = useSplit();

    const allPeople = [
        { id: "payer", name: "You (Payer)", email: formData.payer.email },
        ...formData.people,
    ];

    const subtotal = parseFloat(formData.subtotal) || 0;
    const tax = parseFloat(formData.tax) || 0;
    const tip = parseFloat(formData.tip) || 0;
    const total = subtotal + tax + tip;

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>Review & Confirm</h2>

            <div className={styles.section}>
                <label className={styles.label}>Original Payer</label>
                <div className={styles.personCard}>
                    <div className={styles.avatar}>
                        <i className="fas fa-user"></i>
                    </div>
                    <div className={styles.personInfo}>
                        <div className={styles.personName}>You (Payer)</div>
                    </div>
                    <div className={styles.personAmount}>{total.toFixed(2)} Rs</div>
                </div>
            </div>

            <label className={styles.label}>Bill Split Summary</label>
            {allPeople.map((person) => {
                const amount = calculatePersonAmount(person.id);
                return (
                    <div key={person.id} className={styles.personCard}>
                        <div className={styles.avatar}>
                            <i className="fas fa-user"></i>
                        </div>
                        <div className={styles.personInfo}>
                            <div className={styles.personName}>{person.name}</div>
                        </div>
                        <div className={styles.personAmount}>
                            {amount.toFixed(2)} Rs
                        </div>
                        <button type="button" className={styles.btnView}>
                            View
                        </button>
                    </div>
                )
            })}

            <div className={styles.finalTotal}>
                <span>Total Amount</span>
                <span>{total.toFixed(2)} Rs</span>
            </div>

            <div className={styles.checkboxGroup}>
                <label className={styles.checkbox}>
                    <input type="checkbox" />
                    <span>Send split summary to everyone</span>
                </label>
                <label className={styles.checkbox}>
                    <input type="checkbox" />
                    <span>Email a personal copy</span>
                </label>
            </div>

            <div className={styles.btnRow}>
                <button type="button" onClick={prevStep} className={styles.btnSecondary}>
                    Back
                </button>
                <button type="button" onClick={nextStep} className={styles.btnPrimary}>
                    Done
                </button>
            </div>
        </div>
    );
};

export default Step6;