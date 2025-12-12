import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, PawPrint, UserPlus } from 'lucide-react';

// Zod validation schema
const registerSchema = z.object({
    name: z
        .string()
        .min(1, 'Họ và tên là bắt buộc')
        .min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
    email: z
        .string()
        .min(1, 'Email là bắt buộc')
        .email('Email không hợp lệ'),
    password: z
        .string()
        .min(1, 'Mật khẩu là bắt buộc')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
        .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số'),
    confirmPassword: z
        .string()
        .min(1, 'Xác nhận mật khẩu là bắt buộc'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
});

export default function RegisterForm({ setView }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
    });

    const onSubmit = async (data) => {
        try {
            console.log('Register data:', data);
        } catch (error) {
            console.error('Register error:', error);
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
                        <button 
                            className="tab-button tab-inactive"
                            type="button"
                            onClick={() => setView('login')}
                        >
                            Đăng nhập
                        </button>
                        <button className="tab-button tab-active" type="button">
                            Đăng ký
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    {/* Name Field */}
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Họ và tên
                        </label>
                        <input
                            {...register('name')}
                            type="text"
                            id="name"
                            className={`form-input ${errors.name ? 'form-input-error' : ''}`}
                            placeholder="Nhập họ và tên"
                        />
                        {errors.name && (
                            <span className="form-error">{errors.name.message}</span>
                        )}
                    </div>

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

                    {/* Confirm Password Field */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            Xác nhận mật khẩu
                        </label>
                        <div className="password-input-wrapper">
                            <input
                                {...register('confirmPassword')}
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                className={`form-input ${errors.confirmPassword ? 'form-input-error' : ''}`}
                                placeholder="Nhập lại mật khẩu"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label="Toggle confirm password visibility"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="password-icon" />
                                ) : (
                                    <Eye className="password-icon" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <span className="form-error">{errors.confirmPassword.message}</span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang xử lý...' : (
                            <>
                                <UserPlus size={18} />
                                Đăng ký
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}