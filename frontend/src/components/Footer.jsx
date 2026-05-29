import styles from '../scss/components/Footer.module.scss';
import logo from '../assets/EquiPay-Logo-With-Text.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className={styles.footer}>
        <div className={styles.topSpacer}>
            <div className={styles.logoContainer}>
                <img src={logo} alt="EquiPay Logo" className={styles.logoImage} />
                <p className={styles.logoDescription}>A fast, fair bill-splitting tool for groups to track who owes what and settle up with confidence.</p>
            </div>
            <div className={styles.footerLinks}>
                <div className={styles.footerLinksTitle}>
                    <h1 className={styles.linksTitle}>Quick Links</h1>
                </div>
                <div className={styles.linksList}>
                    <Link to="/" className={styles.linkItem}>Home</Link>
                    <Link to="/split" className={styles.linkItem}>Split</Link>
                    <Link to="/dashboard" className={styles.linkItem}>Dashboard</Link>
                </div>
            </div>
        </div>
        <div className={styles.footerContent}>
            <p className={styles.footerText}>© 2024 EquiPay by Reuben George. All rights reserved.</p>
        </div>
    </footer>
  );
};

export default Footer;
