import { X, Camera, User } from 'lucide-react';

export default function ChangeAvatarModal({ onClose, onUpload }) {
    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            onUpload(file);
        }
    };

    return (
        <div className="profile-modal-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                <div className="profile-modal-header">
                    <h3 className="profile-modal-title">Đổi ảnh đại diện</h3>
                    <button className="profile-modal-close" onClick={onClose}>
                        <X size={20} color="#6B7280" />
                    </button>
                </div>
                <div className="profile-modal-body">
                    <div className="avatar-upload-section">
                        <div className="avatar-preview">
                            <User size={48} color="#059669" />
                        </div>
                        <label className="avatar-upload-btn">
                            <Camera size={18} />
                            <span>Chọn ảnh</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                hidden
                            />
                        </label>
                        <p className="avatar-upload-hint">Hỗ trợ: JPG, PNG. Tối đa 5MB</p>
                    </div>
                </div>
                <div className="profile-modal-actions">
                    <button className="profile-modal-cancel" onClick={onClose}>
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
}
