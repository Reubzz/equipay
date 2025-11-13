import styles from "../scss/HomePage.module.scss";
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <main className={styles.main}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroBackground}></div>
                <div className={styles.heroGradient}></div>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Split Bills. Share Smiles. Stay Fair.
                    </h1>
                    <h2 className={styles.heroSubtitle}>
                        The smartest and simplest way to share expenses with friends.
                    </h2>
                    <button className={styles.heroBtn}>
                        <Link to="/split" className={styles.heroLink}>Start a Split</Link>
                    </button>
                </div>
            </section>

            {/* Why EquiPay Section */}
            <section className={styles.features}>
                <div className={styles.featuresContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Why EquiPay?</h2>
                        <p className={styles.sectionSubtitle}>
                            Discover the powerful features that make splitting bills
                            effortless and fair.
                        </p>
                    </div>
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureGlow}></div>
                            <div className={styles.featureIcon}>
                                <span className="material-symbols-outlined">bolt</span>
                            </div>
                            <div className={styles.featureContent}>
                                <h3>Create Splits Instantly</h3>
                                <p>
                                    Quickly create and share a new bill split with your friends
                                    in just a few taps.
                                </p>
                            </div>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureGlow}></div>
                            <div className={styles.featureIcon}>
                                <span className="material-symbols-outlined">receipt_long</span>
                            </div>
                            <div className={styles.featureContent}>
                                <h3>Smart Itemized Sharing</h3>
                                <p>
                                    Easily assign individual items to different people for
                                    accurate expense division.
                                </p>
                            </div>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureGlow}></div>
                            <div className={styles.featureIcon}>
                                <span className="material-symbols-outlined">monitoring</span>
                            </div>
                            <div className={styles.featureContent}>
                                <h3>Track Balances & Settlements</h3>
                                <p>
                                    Keep a clear record of who owes what and settle up with
                                    ease.
                                </p>
                            </div>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureGlow}></div>
                            <div className={styles.featureIcon}>
                                <span className="material-symbols-outlined">mail</span>
                            </div>
                            <div className={styles.featureContent}>
                                <h3>Email Summaries</h3>
                                <p>
                                    Get detailed summaries of your splits sent directly to your
                                    inbox for your records.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className={styles.howItWorks}>
                <div className={styles.howItWorksContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>How It Works</h2>
                        <p className={styles.sectionSubtitle}>
                            A simple, transparent process from start to finish.
                        </p>
                    </div>
                    <div className={styles.stepsGrid}>
                        <div className={styles.stepCard}>
                            <div className={styles.stepIconWrapper}>
                                <span className="material-symbols-outlined">note_add</span>
                                <div className={styles.stepNumber}>1</div>
                            </div>
                            <h3 className={styles.stepTitle}>Setup</h3>
                            <p className={styles.stepDescription}>
                                Create a new split and add the people who are sharing the
                                bill.
                            </p>
                            <div className={styles.stepArrow}>
                                <svg
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>

                        <div className={styles.stepCard}>
                            <div className={styles.stepIconWrapper}>
                                <span className="material-symbols-outlined">call_split</span>
                                <div className={styles.stepNumber}>2</div>
                            </div>
                            <h3 className={styles.stepTitle}>Split</h3>
                            <p className={styles.stepDescription}>
                                Add bill items, then assign them. Tax & tip are split
                                automatically.
                            </p>
                            <div className={styles.stepArrow}>
                                <svg
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>

                        <div className={styles.stepCard}>
                            <div className={styles.stepIconWrapper}>
                                <span className="material-symbols-outlined">share</span>
                                <div className={styles.stepNumber}>3</div>
                            </div>
                            <h3 className={styles.stepTitle}>Share</h3>
                            <p className={styles.stepDescription}>
                                Review the final split and share the link with everyone to
                                settle up.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HomePage;