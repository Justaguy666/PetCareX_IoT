import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginForm({ setView }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic
        console.log({ email, password, rememberMe });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Header Section */}
                <div className="login-header">
                    <h1 className="login-title">🐾 PetCare</h1>
                    <p className="login-subtitle">Chăm sóc thú cưng của bạn</p>
                </div>

                {/* Tab Navigation */}
                <div className="tab-container">
                    <div className="tab-wrapper">
                        <button className="tab-button tab-active">
                            Đăng nhập
                        </button>
                        <button 
                            className="tab-button tab-inactive"
                            onClick={() => setView('register')}
                        >
                            Đăng ký
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">
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

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Mật khẩu
                        </label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className="form-input"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? (
                                    <EyeOff className="password-icon" />
                                ) : (
                                    <Eye className="password-icon" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="form-options">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                className="checkbox-input"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span className="checkbox-text">Ghi nhớ đăng nhập</span>
                        </label>
                        <button
                            type="button"
                            className="forgot-password-link"
                            onClick={() => setView('forgotPassword')}
                        >
                            Quên mật khẩu?
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="submit-button">
                        🔑 Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
}