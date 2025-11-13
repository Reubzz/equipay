import { useSplit } from "../../context/SplitContext";
import styles from "../../scss/components/Steps.module.scss";


const Step7 = () => {
    const { formData } = useSplit();

    const handleSaveToDatabase = async () => {
        // Save to database logic here
        console.log("Saving to database:", formData);

        // Example API call:
        /*
        try {
          const response = await fetch('/api/splits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
          const result = await response.json();
          console.log('Saved successfully:', result);
        } catch (error) {
          console.error('Save failed:', error);
        }
        */

        alert("Split data saved successfully!");
    };

    const handleNewSplit = () => {
        window.location.reload();
    };

    return (
        <div className={`${styles.card} ${styles.completeCard}`}>
            <div className={styles.completeContent}>
                <div className={styles.successIcon}>
                    <i className="fas fa-check"></i>
                </div>
                <h2 className={styles.title}>Split Completed !!</h2>
                <p className={styles.completeText}>
                    Sent split summary and payment details to
                </p>
            </div>

            <div className={styles.emailList}>
                <div className={styles.emailItem}>
                    <span>{formData.payer.email || "test@reubz.io"}</span>
                </div>
                {formData.people.map(
                    (person) =>
                        person.email && (
                            <div key={person.id} className={styles.emailItem}>
                                <span>{person.email}</span>
                            </div>
                        )
                )}
            </div>

            <div className={styles.btnRow}></div>
            <button
                type="button"
                onClick={handleNewSplit}
                className={styles.btnSecondary}
            >
                Back to Home
            </button>
            <button
                type="button"
                onClick={handleSaveToDatabase}
                className={styles.btnPrimary}
            >
                New Split
            </button>
        </div>
    );
};

export default Step7;