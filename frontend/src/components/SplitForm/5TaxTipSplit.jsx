import { useSplit } from "../../context/SplitContext";
import styles from "../../scss/components/Steps.module.scss";


const Step5 = ({ nextStep, prevStep }) => {
    const { formData, updateForm } = useSplit();

    const subtotal = parseFloat(formData.subtotal) || 0;
    const tax = parseFloat(formData.tax) || 0;
    const tip = parseFloat(formData.tip) || 0;
    const total = subtotal + tax + tip;

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>Tax & Tip Split</h2>

            <div className={styles.splitOption}>
                <div className={styles.splitHeader}>
                    <span>Tax</span>
                    <span className={styles.splitAmount}>{formData.tax} Rs</span>
                </div>
                <div className={styles.toggleBtnGroup}>
                    <button
                        type="button"
                        onClick={() => updateForm({ taxSplit: "equal" })}
                        className={`${styles.toggleBtn} ${formData.taxSplit === "equal" ? styles.toggleBtnActive : ""
                            }`}
                    >
                        Equal
                    </button>
                    <button
                        type="button"
                        onClick={() => updateForm({ taxSplit: "proportional" })}
                        className={`${styles.toggleBtn} ${formData.taxSplit === "proportional" ? styles.toggleBtnActive : ""
                            }`}
                    >
                        Proportional
                    </button>
                </div>
            </div>

            <div className={styles.splitOption}>
                <div className={styles.splitHeader}>
                    <span>Tip</span>
                    <span className={styles.splitAmount}>{formData.tip} Rs</span>
                </div>
                <div className={styles.toggleBtnGroup}>
                    <button
                        type="button"
                        onClick={() => updateForm({ tipSplit: "equal" })}
                        className={`${styles.toggleBtn} ${formData.tipSplit === "equal" ? styles.toggleBtnActive : ""
                            }`}
                    >
                        Equal
                    </button>
                    <button
                        type="button"
                        onClick={() => updateForm({ tipSplit: "proportional" })}
                        className={`${styles.toggleBtn} ${formData.tipSplit === "proportional" ? styles.toggleBtnActive : ""
                            }`}
                    >
                        Proportional
                    </button>
                </div>
            </div>

            <div className={styles.finalTotal}>
                <span>Total Amount</span>
                <span>{total.toFixed(2)} Rs</span>
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

export default Step5;