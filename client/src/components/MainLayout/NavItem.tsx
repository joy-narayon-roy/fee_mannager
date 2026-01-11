import React from 'react';
import styles from './styles/mainlayout.module.css';
import { Link, useLocation, } from 'react-router-dom';

type NavItemProps = {
    children: React.ReactNode; // This types the children properly
    href: string
};

export default function NavItem({ children, href }: NavItemProps) {
    const { pathname } = useLocation()
    const isActive =
        pathname === href || pathname.startsWith(`${href}/`);
    return (

        <Link to={href} className={`${styles['nav-item']} ${isActive && styles['nav-item-active']}`}>
            {children}
        </Link>
    );
}
