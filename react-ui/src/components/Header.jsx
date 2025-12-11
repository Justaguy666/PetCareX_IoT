export default function Header({ title, intro, icon = '🐾' }) {
    return (
        <header className="app-header">
            <h1 className="app-header-title">
                {icon && <span className="app-header-icon">{icon}</span>}
                {title}
            </h1>
            <p className="app-header-intro">{intro}</p>
        </header>
    );
}