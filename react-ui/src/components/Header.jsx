export default function Header({ title, intro }) {
    return (
        <header className="header"> 
            <h1 className="header-title">{title}</h1>
            <p className="header-intro">{intro}</p>
        </header>
    );
}