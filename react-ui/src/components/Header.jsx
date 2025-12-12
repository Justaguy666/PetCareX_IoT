import { PawPrint } from 'lucide-react';

export default function Header({ title, intro, Icon = PawPrint }) {
    return (
        <header className="app-header">
            <h1 className="app-header-title">
                {Icon && <span className="app-header-icon"><Icon size={28} /></span>}
                {title}
            </h1>
            <p className="app-header-intro">{intro}</p>
        </header>
    );
}