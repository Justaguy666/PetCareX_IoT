import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

export default function ChangePasswordModal({ onClose, onSave }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSave = () => {
        if (currentPassword && newPassword && confirmPassword) {
            if (newPassword === confirmPassword) {
                onSave({ currentPassword, newPassword });
            } else {
                alert('Mật khẩu mới không khớp');
            }
        }
    };

    return (
        <div className="profile-modal-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                <div className="profile-modal-header">
                    <h3 className="profile-modal-title">Đổi mật khẩu</h3>
                    <button className="profile-modal-close" onClick={onClose}>
                        <X size={20} color="#6B7280" />
                    </button>
                </div>
                <div className="profile-modal-body">
                    <div className="profile-form-group">
                        <label className="profile-form-label">Mật khẩu hiện tại</label>
                        <div className="profile-password-wrapper">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                className="profile-form-input"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                            <button 
                                type="button"
                                className="profile-password-toggle"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="profile-form-group">
                        <label className="profile-form-label">Mật khẩu mới</label>
                        <div className="profile-password-wrapper">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                className="profile-form-input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                            />
                            <button 
                                type="button"
                                className="profile-password-toggle"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="profile-form-group">
                        <label className="profile-form-label">Xác nhận mật khẩu mới</label>
                        <div className="profile-password-wrapper">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="profile-form-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                            />
                            <button 
                                type="button"
                                className="profile-password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="profile-modal-actions">
                    <button className="profile-modal-cancel" onClick={onClose}>
                        Hủy
                    </button>
                    <button className="profile-modal-confirm" onClick={handleSave}>
                        Đổi mật khẩu
                    </button>
                </div>
            </div>
        </div>
    );
}
