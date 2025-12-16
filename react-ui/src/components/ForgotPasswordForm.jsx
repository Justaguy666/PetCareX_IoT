import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, PawPrint, CheckCircle } from 'lucide-react';
import { toast } from "react-toastify";
import authService from "../services/authService";

// Zod validation schema
const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'Email là bắt buộc')
        .email('Email không hợp lệ'),
});

export default function ForgotPasswordForm({ setView }) {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data) => {
        try {
            const { email } = data;
            await authService.forgotPassword(email);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Forgot password error:', error);
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
                    <p className="login-subtitle">Quên mật khẩu</p>
                </div>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                        <p className="form-description">
                            Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
                        </p>

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

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </button>

                        {/* Back to Login */}
                        <button
                            type="button"
                            className="back-button"
                            onClick={() => setView('login')}
                        >
                            <ArrowLeft size={16} />
                            <span>Quay lại đăng nhập</span>
                        </button>
                    </form>
                ) : (
                    <div className="success-message">
                        <div className="success-text">
                            <CheckCircle size={20} className="success-icon" />
                            <span>Đã gửi email hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.</span>
                        </div>
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