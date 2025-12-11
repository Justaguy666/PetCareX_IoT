import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, BarChart3, Settings, User } from 'lucide-react';

const navItems = [
    { path: '/', icon: Home, label: 'Trang chủ', emoji: '🏠' },
    { path: '/schedule', icon: Calendar, label: 'Lịch trình', emoji: '📅' },
    { path: '/history', icon: BarChart3, label: 'Lịch sử', emoji: '📊' },
    { path: '/settings', icon: Settings, label: 'Thiết lập', emoji: '⚙️' },
    { path: '/personal-information', icon: User, label: 'Thông tin', emoji: '👤' },
];

export default function Footer() {
    const location = useLocation();

    return (
        <footer className="footer-nav">
            <div className="footer-nav-container">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`footer-nav-item ${isActive ? 'footer-nav-item-active' : ''}`}
                        >
                            <div className="footer-nav-icon-wrapper">
                                <span className="footer-nav-emoji">{item.emoji}</span>
                            </div>
                            <span className={`footer-nav-label ${isActive ? 'footer-nav-label-active' : ''}`}>
                                {item.label}
                            </span>
                        </NavLink>
                    );
                })}
            </div>
        </footer>
    );
}