import { useState } from 'react';
import { User, Pencil, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/authContext';
import EditEmailModal from '../components/EditEmailModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import ChangeAvatarModal from '../components/ChangeAvatarModal';

export default function PersonalInformation() {
    const { logout, user } = useAuth();
    const [showEditEmail, setShowEditEmail] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showChangeAvatar, setShowChangeAvatar] = useState(false);
    
    const [email, setEmail] = useState(user?.email || 'nguyenvanan@gmail.com');

    const userInfo = {
        name: user?.name || 'Nguyễn Văn An',
        email: email,
        password: '••••••••'
    };

    const handleSaveEmail = (newEmail) => {
        setEmail(newEmail);
        setShowEditEmail(false);
    };

    const handleSavePassword = (passwordData) => {
        console.log('Password changed successfully', passwordData);
        setShowChangePassword(false);
    };

    const handleAvatarUpload = (file) => {
        console.log('Avatar uploaded:', file.name);
        setShowChangeAvatar(false);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="profile-page">
            <div className="profile-card">
                <h2 className="profile-title">Thông tin cá nhân</h2>
                
                <div className="profile-avatar-section">
                    <div className="profile-avatar">
                        <User size={32} color="#FFFFFF" />
                        <button className="avatar-edit-btn" onClick={() => setShowChangeAvatar(true)}>
                            <Pencil size={12} color="#059669" />
                        </button>
                    </div>
                    <h3 className="profile-name">{userInfo.name}</h3>
                </div>

                <div className="profile-info-list">
                    <div className="profile-info-item">
                        <div className="profile-info-content">
                            <span className="profile-info-label">Email</span>
                            <span className="profile-info-value">{userInfo.email}</span>
                        </div>
                        <button className="profile-edit-btn" onClick={() => setShowEditEmail(true)}>
                            Chỉnh sửa
                        </button>
                    </div>

                    <div className="profile-info-item">
                        <div className="profile-info-content">
                            <span className="profile-info-label">Mật khẩu</span>
                            <span className="profile-info-value">{userInfo.password}</span>
                        </div>
                        <button className="profile-edit-btn" onClick={() => setShowChangePassword(true)}>
                            Đổi mật khẩu
                        </button>
                    </div>
                </div>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
                <div className="logout-icon">
                    <LogOut size={14} color="#FFFFFF" />
                </div>
                <span className="logout-text">Đăng xuất</span>
                <ChevronRight size={16} color="#DC2626" className="logout-arrow" />
            </button>

            {showEditEmail && (
                <EditEmailModal
                    currentEmail={email}
                    onClose={() => setShowEditEmail(false)}
                    onSave={handleSaveEmail}
                />
            )}

            {showChangePassword && (
                <ChangePasswordModal
                    onClose={() => setShowChangePassword(false)}
                    onSave={handleSavePassword}
                />
            )}

            {showChangeAvatar && (
                <ChangeAvatarModal
                    onClose={() => setShowChangeAvatar(false)}
                    onUpload={handleAvatarUpload}
                />
            )}
        </div>
    );
}