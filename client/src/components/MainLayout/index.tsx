import { Link, Outlet } from "react-router-dom";
import styles from "./styles/mainlayout.module.css";
import NavItem from "./NavItem";
import { useState } from "react";
import { HiBars3 } from "react-icons/hi2";
import { useBreakpoint } from "../../hooks/useBreakpoint";

const MainLayout = () => {
    const navItems = [
        { text: "Dashboard", path: "/" },
        { text: "Students", path: "/student" },
        { text: "Schedule", path: "/schedule" },
        { text: "Summary", path: "/summary" },
    ];
    const current_device = useBreakpoint()
    const is_sm =  current_device==='sm'||current_device==='base'
    const [isNavOpen, setIsNavOpen] = useState(false);

    const onClose=()=>{
        if (is_sm) {
            setIsNavOpen(false)
        }
    }

    return (
        <>
            <header className={styles.header}>
                <div className={styles.headerLogo}>
                    <h1><Link to="/" className="text-3xl">Fee Manager</Link></h1>
                </div>

                <button
                    className={styles.menuBtn}
                    onClick={() => setIsNavOpen(prev => !prev)}
                >
                    <HiBars3 size={20} />
                </button>
            </header>

            <div className={styles.body}>
                {/* <aside
                    className={`${styles.body_aside} ${!isNavOpen ? styles.hide : ""
                        }`}
                > */}
                <aside
                    className={`${isNavOpen ? styles.body_aside : styles.hide}`}
                >

                    {navItems.map((n, k) => (
                        <NavItem key={k} href={n.path} onClose={onClose}>
                            {n.text}
                        </NavItem>
                    ))}
                </aside>

                <main className={`${styles.main} p-2`} >
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default MainLayout;
