import { Link } from 'react-router-dom';
import { PawPrint, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="not-found-container">
            <div className="not-found-card">
                <div className="not-found-icon">
                    <PawPrint size={64} />
                </div>
                <h1 className="not-found-code">404</h1>
                <h2 className="not-found-title">Trang không tìm thấy</h2>
                <p className="not-found-message">
                    Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                </p>
                <Link to="/" className="not-found-button">
                    <Home size={18} />
                    <span>Quay về trang chủ</span>
                </Link>
            </div>
        </div>
    );
}