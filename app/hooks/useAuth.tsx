import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export const useAuth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter(); 

    const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
        
        if (signInError) {
        setError("Signin Error: " + signInError.message);
        return;
        }

        // Check if a valid session exists.
        if (!data.session) {
        setError("Signin failed: No session. Ensure your account is confirmed.");
        return;
        }

        // On success, redirect to the Dashboard.
        router.push("/dashboard");
        } catch (error) {
         setError("An unexpected error occurred: ");
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email: string) => {
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            });

            if (error) {
                setError("Password reset error: " + error.message);
            } else {
                setMessage("Password reset email sent successfully. Check your inbox.");
            }
        } catch (error) {
            setError("An unexpected error occurred: ");
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (newPassword: string) => {
        setError('');
        setLoading(true);

        try{
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if(error) {
                setError('Error updating password' + error.message);
            } else {
                setMessage('Password updated successfully. You can now log in with your new password.');
                router.push('/login');
            }

        } catch (error) {
            setError("An unexpected error occurred: ");
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        error,
        loading,
        message,
        signIn,
        forgotPassword,
        resetPassword,
        setError,
        setMessage
    };
};
