import React from 'react';
import styles from '../scss/components/Navbar.module.scss';
import logo from '../assets/EquiPay-Logo.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarStart}>
                <img src={logo} alt="Logo" className={styles.logo} />
                <h1 className={styles.title}>EquiPay</h1>
            </div>
            <div className={styles.navbarCenter}>
                <Link to="/" className={styles.navLink}>Home</Link>
                <Link to="/split" className={styles.navLink}>Split</Link>
                <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
            </div>
            <div className={styles.navbarEnd}>
                <button className={`${styles.loginButton} ${styles.authButton}`}>Login</button>
                <button className={`${styles.signupButton} ${styles.authButton}`}>Sign Up</button>
            </div>
        </nav>
    );
}

export default Navbar;