import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, BarChart3, Settings, User } from 'lucide-react';

const navItems = [
    { path: '/', Icon: Home, label: 'Trang chủ' },
    { path: '/schedule', Icon: Calendar, label: 'Lịch trình' },
    { path: '/history', Icon: BarChart3, label: 'Lịch sử' },
    { path: '/settings', Icon: Settings, label: 'Thiết lập' },
    { path: '/personal-information', Icon: User, label: 'Thông tin' },
];

export default function Footer() {
    const location = useLocation();

    return (
        <footer className="footer-nav">
            <div className="footer-nav-container">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const IconComponent = item.Icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`footer-nav-item ${isActive ? 'footer-nav-item-active' : ''}`}
                        >
                            <div className="footer-nav-icon-wrapper">
                                <IconComponent size={22} strokeWidth={isActive ? 2.5 : 2} />
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