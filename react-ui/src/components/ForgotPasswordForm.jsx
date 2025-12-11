import { useState } from 'react';

export default function ForgotPasswordForm({ setView }) {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ email });
        setIsSubmitted(true);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1 className="login-title">🐾 PetCare</h1>
                    <p className="login-subtitle">Quên mật khẩu</p>
                </div>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="login-form">
                        <p className="form-description">
                            Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
                        </p>

                        {/* Email Field */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="form-input"
                                placeholder="Nhập email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="submit-button">
                            Gửi yêu cầu
                        </button>

                        {/* Back to Login */}
                        <button
                            type="button"
                            className="back-button"
                            onClick={() => setView('login')}
                        >
                            ← Quay lại đăng nhập
                        </button>
                    </form>
                ) : (
                    <div className="success-message">
                        <p className="success-text">
                            ✓ Đã gửi email hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.
                        </p>
                        <button
                            className="submit-button"
                            onClick={() => setView('login')}
                        >
                            Quay lại đăng nhập
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}