'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toaster, toast } from 'sonner';

const API_BASE_URL = 'http://localhost:8088';
const LOGIN_ENDPOINT = `${API_BASE_URL}/api/v1/auth/authenticate`;

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const domain = '@manuo.com';

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post(
                LOGIN_ENDPOINT,
                {
                    email: `${username}${domain}`,
                    password: password,
                    otp: otp
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = response.data;

            if (response.status === 200) {
                sessionStorage.setItem('token', data.token);
                toast.success('Login successful!');
                router.push('/home/profile');
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
                toast.error('Login failed');
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || 'An error occurred. Please try again later.');
            toast.error('Login error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Toaster position="top-center" />
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Sign in to your account</h2>

                </div>

                {error && (
                    <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="block w-full pr-10"
                                    placeholder="yourname"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.replace(/@.*$/, ''))}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">@manuo.com</span>
                                </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Your full email will be: {username}@manuo.com
                            </p>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                OTP
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="otp"
                                    name="otp"
                                    type="otp"
                                    autoComplete="current-otp"
                                    required
                                    className="block w-full"
                                    placeholder="••••••••"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full flex justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </div>
                </form>

                <div className="text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Manuo. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;