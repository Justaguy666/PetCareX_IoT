import { useState } from 'react';
import { X } from 'lucide-react';

export default function EditEmailModal({ currentEmail, onClose, onSave }) {
    const [newEmail, setNewEmail] = useState(currentEmail);

    const handleSave = () => {
        if (newEmail.trim()) {
            onSave(newEmail);
        }
    };

    return (
        <div className="profile-modal-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                <div className="profile-modal-header">
                    <h3 className="profile-modal-title">Chỉnh sửa Email</h3>
                    <button className="profile-modal-close" onClick={onClose}>
                        <X size={20} color="#6B7280" />
                    </button>
                </div>
                <div className="profile-modal-body">
                    <div className="profile-form-group">
                        <label className="profile-form-label">Email mới</label>
                        <input
                            type="email"
                            className="profile-form-input"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Nhập email mới"
                        />
                    </div>
                </div>
                <div className="profile-modal-actions">
                    <button className="profile-modal-cancel" onClick={onClose}>
                        Hủy
                    </button>
                    <button className="profile-modal-confirm" onClick={handleSave}>
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
}
