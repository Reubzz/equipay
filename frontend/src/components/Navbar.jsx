import React, { useEffect, useRef, useState } from 'react';
import styles from '../scss/components/Navbar.module.scss';
import logo from '../assets/EquiPay-Logo.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuId = "mobile-menu";
    const hamburgerRef = useRef(null);
    const panelRef = useRef(null);

    useEffect(() => {
        if (!isMenuOpen) {
            document.body.style.overflow = "";
            if (hamburgerRef.current) {
                hamburgerRef.current.focus();
            }
            return undefined;
        }

        const panel = panelRef.current;
        if (!panel) return undefined;

        const getFocusable = () =>
            Array.from(
                panel.querySelectorAll(
                    "a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex='-1'])"
                )
            ).filter((el) => !el.hasAttribute("disabled"));

        const handleKeyDown = (event) => {
            if (!isMenuOpen) return;
            if (event.key === "Escape") {
                event.preventDefault();
                setIsMenuOpen(false);
                return;
            }
            if (event.key !== "Tab") return;
            const focusable = getFocusable();
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.body.style.overflow = "hidden";
        const focusable = getFocusable();
        if (focusable.length > 0) {
            focusable[0].focus();
        }
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isMenuOpen]);

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.navbarStart}>
                    <img src={logo} alt="Logo" className={styles.logo} />
                    <h1>EquiPay</h1>
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
                <button
                    type="button"
                    className={styles.hamburger}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    aria-controls={menuId}
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen((open) => !open)}
                    ref={hamburgerRef}
                >
                    <span className={styles.hamburgerLine}></span>
                    <span className={styles.hamburgerLine}></span>
                    <span className={styles.hamburgerLine}></span>
                </button>
            </nav>
            {isMenuOpen && (
                <div
                    className={`${styles.menuOverlay} ${styles.menuOverlayOpen}`}
                    onClick={closeMenu}
                >
                    <div
                        className={`${styles.menuPanel} ${styles.menuPanelOpen}`}
                        onClick={(event) => event.stopPropagation()}
                        id={menuId}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="mobile-menu-title"
                        ref={panelRef}
                    >
                        <div className={styles.menuHeader}>
                            <span className={styles.menuTitle} id="mobile-menu-title">Menu</span>
                            <button type="button" className={styles.menuClose} onClick={closeMenu}>
                                Close
                            </button>
                        </div>
                        <nav className={styles.menuLinks}>
                            <Link to="/" className={styles.menuLink} onClick={closeMenu}>Home</Link>
                            <Link to="/split" className={styles.menuLink} onClick={closeMenu}>Split</Link>
                            <Link to="/dashboard" className={styles.menuLink} onClick={closeMenu}>Dashboard</Link>
                        </nav>
                        <div className={styles.menuActions}>
                            <button className={`${styles.loginButton} ${styles.authButton}`}>Login</button>
                            <button className={`${styles.signupButton} ${styles.authButton}`}>Sign Up</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;