import { useState } from 'react';
import { useAuth } from '../../hooks/auth/useAuth';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose}: ForgotPasswordModalProps) {
    const [email, setEmail] = useState('');
    const { forgotPassword, loading, error, message } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await forgotPassword(email);
        if(!error) {
            setTimeout(() => {
                onClose();
                setEmail('');
            }, 3000);
        }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className='bg-gray-900/90 border border-cyan-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-cyan-500/10'>
            <div className='text-center mb-6'>
                <h2 className='text-lg font-semibold text-white mb-2'>Forgot Password</h2>
                <p className='text-sm text-gray-400'>Enter your email to reset your password</p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
                {error && (
                    <div className='p-4 bg-red-500/10 border border-red-500/20 rounded-lg'>
                        <p className='text-sm text-red-500 text-center'>{error}</p>
                    </div>
                )}
                
                {message && (
                    <div className='p-4 bg-green-500/10 border border-green-500/20 rounded-lg'>
                        <p className='text-sm text-green-500 text-center'>{message}</p>
                    </div>
                )}

                <div>
                    <label htmlFor="reset-email"
                    className='block text-sm font-medium text-white mb-2'
                    >
                        Email Address
                    </label>
                    <input type="email" 
                    id='reset-email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all'
                    placeholder='Enter your email'
                    required
                    />
                </div>

                <div className='flex gap-3'>
                    <button
                    type='button'
                    onClick={onClose}
                    className='flex-1 py-3 px-4 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors'
                    disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                    type='submit'
                    disabled={loading}
                    className='flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:transform-none'
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                </div>

            </form>

        </div>
      </div>  
    );
};