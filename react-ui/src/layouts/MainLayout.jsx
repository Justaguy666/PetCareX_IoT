import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import AssistantPopup from '../components/AssitantPopup.jsx';
import { PawPrint } from 'lucide-react';

export default function MainLayout({ children, title, intro, Icon = PawPrint }) {
    return (
        <div className="main-layout">
            <Header title={title} intro={intro} Icon={Icon} />
            <main className="main-content-with-footer">
                {children}
            </main>
            <Footer />
            <AssistantPopup />
        </div>
    );
}
