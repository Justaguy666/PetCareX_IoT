import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import AssistantPopup from '../components/AssitantPopup.jsx';

export default function MainLayout({ children, title, intro, icon = '🐾' }) {
    return (
        <div className="main-layout">
            <Header title={title} intro={intro} icon={icon} />
            <main className="main-content-with-footer">
                {children}
            </main>
            <Footer />
            <AssistantPopup />
        </div>
    );
}
