import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export const useAuth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    const router = useRouter(); 

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: {session} } = await supabase.auth.getSession();

                if (!session) {
                    setIsAuthenticated(false);
                    setUser(null);
                } else {
                    setIsAuthenticated(true);
                    setUser(session.user);
                }
            } catch (error) {
                console.error("Error checking auth:", error);
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        };

        checkAuth();

        const { data: {subscription} } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event ===  'SIGNED_OUT' || !session) {
                    setIsAuthenticated(false);
                    setUser(null);
                } else if (event === 'SIGNED_IN') {
                    setIsAuthenticated(true);
                    setUser(session.user);
                }
                setAuthLoading(false);
            }
        );
        return () => subscription.unsubscribe();
    }, []);

    const requireAuth = () => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    };

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

     // Add the logout function
    const logout = async () => {
        try {
            await supabase.auth.signOut();
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
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
        setMessage,

        // Auth guard properties
        isAuthenticated,
        authLoading,
        user,
        requireAuth,
        logout
    };
};
