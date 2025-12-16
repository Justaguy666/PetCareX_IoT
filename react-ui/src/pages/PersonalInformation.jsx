import { useState, useEffect } from 'react';
import { User, Pencil, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/authContext';
import EditEmailModal from '../components/EditEmailModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import ChangeAvatarModal from '../components/ChangeAvatarModal';
import userService from '../services/userService';
import { toast } from "react-toastify";

export default function PersonalInformation() {
    const { logout, user } = useAuth();
    const [showEditEmail, setShowEditEmail] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showChangeAvatar, setShowChangeAvatar] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [profile, setProfile] = useState({
        username: '',
        email: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await userService.getProfile();
            setProfile({
                username: res.user.username,
                email: res.user.email
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (user) {
                setProfile({
                    username: user.username || user.name || 'User',
                    email: user.email || ''
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSaveEmail = async (newEmail) => {
        try {
            await userService.updateProfile({ email: newEmail });
            setProfile(prev => ({ ...prev, email: newEmail }));
            toast.success('Thay đổi email thành công');
            setShowEditEmail(false);
        } catch (error) {
            console.error('Error updating email:', error);
            toast.error(error.message);
        }
    };

    const handleSavePassword = async (passwordData) => {
        try {
            const { currentPassword, newPassword } = passwordData;
            await userService.changePassword({ currentPassword, newPassword });
            toast.success('Thay đổi mật khẩu thành công');
            setShowChangePassword(false);
        } catch (error) {
            toast.error(error?.message || error?.error);
        }
    };

    const handleAvatarUpload = (file) => {
        console.log('Avatar uploaded:', file.name);
        setShowChangeAvatar(false);
    };

    const handleLogout = () => {
        logout();
    };

    if (loading) {
        return <div className="profile-page"><p>Đang tải...</p></div>;
    }

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
                    <h3 className="profile-name">{profile.username}</h3>
                </div>

                <div className="profile-info-list">
                    <div className="profile-info-item">
                        <div className="profile-info-content">
                            <span className="profile-info-label">Email</span>
                            <span className="profile-info-value">{profile.email}</span>
                        </div>
                        <button className="profile-edit-btn" onClick={() => setShowEditEmail(true)}>
                            Chỉnh sửa
                        </button>
                    </div>

                    <div className="profile-info-item">
                        <div className="profile-info-content">
                            <span className="profile-info-label">Mật khẩu</span>
                            <span className="profile-info-value">••••••••</span>
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
                    currentEmail={profile.email}
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