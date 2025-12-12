import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, PawPrint } from 'lucide-react';

// Zod validation schema
const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email là bắt buộc')
        .email('Email không hợp lệ'),
    password: z
        .string()
        .min(1, 'Mật khẩu là bắt buộc')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    rememberMe: z.boolean().optional(),
});

export default function LoginForm({ setView }) {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    const onSubmit = async (data) => {
        try {
            console.log('Login data:', data);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1 className="login-title">
                        <PawPrint size={32} className="login-title-icon" />
                        <span>PetCare</span>
                    </h1>
                    <p className="login-subtitle">Chăm sóc thú cưng của bạn</p>
                </div>

                {/* Tab Navigation */}
                <div className="tab-container">
                    <div className="tab-wrapper">
                        <button className="tab-button tab-active" type="button">
                            Đăng nhập
                        </button>
                        <button 
                            className="tab-button tab-inactive"
                            type="button"
                            onClick={() => setView('register')}
                        >
                            Đăng ký
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    {/* Email Field */}
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            {...register('email')}
                            type="email"
                            id="email"
                            className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                            placeholder="Nhập email của bạn"
                        />
                        {errors.email && (
                            <span className="form-error">{errors.email.message}</span>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Mật khẩu
                        </label>
                        <div className="password-input-wrapper">
                            <input
                                {...register('password')}
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className={`form-input ${errors.password ? 'form-input-error' : ''}`}
                                placeholder="Nhập mật khẩu"
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
                        {errors.password && (
                            <span className="form-error">{errors.password.message}</span>
                        )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="form-options">
                        <label className="checkbox-label">
                            <input
                                {...register('rememberMe')}
                                type="checkbox"
                                className="checkbox-input"
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
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang xử lý...' : '🔑 Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
}