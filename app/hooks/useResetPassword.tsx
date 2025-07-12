import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export const useResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [tokenValid, setTokenValid ] = useState(false);
    const [tokenChecked, setTokenChecked] = useState(false);

    const router = useRouter();

    const validateToken = useCallback(async (token: string | null, type: string | null): Promise<boolean> => {
        // Basic URL parameter validation
        if (!token || type !== 'recovery') {
            setError('Invalid reset link. Please request a new password reset.');
            return false;
        }

        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
                console.error('Session error:', error);
                setError('Authentication error. Please try clicking the reset link again.');
                return false;
            }

            if (session && session.user) {
                return true;
            }

            setError('Reset session expired. Please request a new password reset.');
            return false;
            
        } catch (error) {
            console.error('Token validation error:', error);
            setError('An error occurred while validating the reset link.');
            return false;
        }
    }, []);

    const checkTokenValidity = useCallback(async (token: string | null, type: string | null) => {
        setLoading(true);
        setTokenChecked(false);

        const isValid = await validateToken(token,type);
        setTokenValid(isValid);
        setTokenChecked(true);

        if (!isValid) {
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        }
        
        setLoading(false);
    }, [validateToken, router]);

    const validatePasswords = (): boolean => {
        setValidationError('');

        if (newPassword.length < 6) {
            setValidationError('Password must be at least 6 characters long');
            return false;
        }

        if (newPassword !== confirmPassword) {
            setValidationError('Passwords do not match');
            return false;
        }

        return true;
    };

    const resetPassword = async (): Promise<boolean>=> {
        setError('');
        setLoading(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) {
                setError('Error updating password: ' + updateError.message);
                return false;
            } else {
                setMessage('Password updated successfully. You can now log in with your new password.');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
                return true;
            }
        } catch (error) {
            setError('An unexpected error occurred:');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!tokenValid) {
            setError('Token is not valid. Please request a new password reset.');
            return;
        }

        if (!validatePasswords()) {
            return;
        }

        await resetPassword();
    };

    const clearErrors = () => {
        setError('');
        setValidationError('');
        setMessage('');
    };

    const resetForm = () => {
        setNewPassword('');
        setConfirmPassword('');
        setShowPassword(false);
        setShowConfirmPassword(false);
        clearErrors();
    }

    return {
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        validationError,
        error,
        message,
        loading,
        tokenValid,
        tokenChecked,

        handleSubmit,
        checkTokenValidity,
        validatePasswords,
        resetPassword,
        clearErrors,
        resetForm
    };
};