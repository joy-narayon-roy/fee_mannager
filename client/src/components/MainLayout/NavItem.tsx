import React from 'react';
import styles from './styles/mainlayout.module.css';
import { useLocation, useNavigate, } from 'react-router-dom';

type NavItemProps = {
    children: React.ReactNode; // This types the children properly
    href: string
    onClose?: () => void
};

export default function NavItem({ children, href, onClose = () => { } }: NavItemProps) {
    const { pathname } = useLocation()
    const nav = useNavigate()
    const isActive =
        pathname === href || pathname.startsWith(`${href}/`);
    return (

        <button onClick={() => { nav(href); onClose() }} className={`${styles['nav-item']} ${isActive && styles['nav-item-active']}`}>
            {children}
        </button>
    );
}
