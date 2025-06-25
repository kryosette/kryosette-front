'use client'

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LogOut, Copy, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react";
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-provider"

function Settings() {
    const { token } = useAuth();
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [totpData, setTotpData] = useState({
        secret: '',
        qrCodeUrl: '',
        currentCode: '',
        timeRemaining: 30
    });

    // Функция для генерации 2FA
    const handleEnable2FA = async () => {
        setIsLoading(true);
        try {
            // 1. Запрашиваем у бэкенда секрет и QR-код
            const response = await fetch('http://localhost:8088/api/v1/totp/generate', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            setTotpData({
                ...data,
                currentCode: '',
                timeRemaining: 30
            });

            setIs2FAEnabled(true);
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    // Функция для отключения 2FA
    const handleDisable2FA = async () => {
        setIsLoading(true);
        try {
            await fetch('/api/2fa/disable', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setIs2FAEnabled(false);
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    // Функция для получения текущего кода
    const fetchCurrentCode = async () => {
        try {
            const response = await fetch('http://localhost:8088/api/v1/totp/current-code', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const { code, timeRemaining } = await response.json();
            setTotpData(prev => ({
                ...prev,
                currentCode: code,
                timeRemaining
            }));
        } catch (error) {
            console.error("Failed to fetch TOTP code", error);
        }
    };

    // Функция для копирования кода
    const copyToClipboard = () => {
        navigator.clipboard.writeText(totpData.currentCode);
    };

    // Эффект для обновления кода каждую секунду
    useEffect(() => {
        if (!is2FAEnabled) return;

        // Первоначальная загрузка кода
        fetchCurrentCode();

        // Устанавливаем интервал для обновления
        const interval = setInterval(() => {
            setTotpData(prev => {
                const newTimeRemaining = prev.timeRemaining - 1;
                if (newTimeRemaining <= 0) {
                    fetchCurrentCode();
                    return { ...prev, timeRemaining: 30 };
                }
                return { ...prev, timeRemaining: newTimeRemaining };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [is2FAEnabled]);

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-3xl mx-auto shadow-md rounded-lg">
                {/* User Info Header */}
                <CardHeader className="flex flex-row items-center space-y-0 pb-2 space-x-4">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src="https://avatars.githubusercontent.com/u/8884394?v=4" />
                        <AvatarFallback>DM</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <CardTitle className="text-lg font-semibold">Dima 853</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">dima853@manuo.com</CardDescription>
                    </div>
                    <div className="ml-auto flex items-center space-x-2">
                        <Button variant="ghost" size="sm">Заявки в друзья</Button>
                        <Button variant="outline" size="sm">
                            <span className="mr-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-user-plus"
                                >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <line x1="19" x2="24" y1="10" y2="10" />
                                    <line x1="22" x2="22" y1="7" y2="13" />
                                </svg>
                            </span>
                            Добавить друга
                        </Button>
                        <Button variant="destructive" size="sm">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </CardHeader>

                {/* Personal Information */}
                <CardContent className="space-y-4">
                    <div className="pb-4 border-b border-gray-200">
                        <CardTitle className="text-base font-semibold">Personal Information</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">Manage your profile details</CardDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" defaultValue="Dima" className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" defaultValue="dima853@manuo.com" className="mt-1" type="email" />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" defaultValue="853" className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="accountId">Account ID</Label>
                            <Input
                                id="accountId"
                                defaultValue="38ce6a65e46e9cf480b1cbb9f870ff7a"
                                className="mt-1"
                                disabled
                            />
                        </div>
                    </div>
                </CardContent>

                {/* 2FA Setting */}
                <CardContent className="space-y-4">
                    <div className="pb-4 border-b border-gray-200">
                        <CardTitle className="text-base font-semibold">Two-Factor Authentication (2FA)</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">Secure your account with 2FA.</CardDescription>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <span>2FA Status: {is2FAEnabled ? "Enabled" : "Disabled"}</span>
                        {is2FAEnabled ? (
                            <Button variant="destructive" onClick={handleDisable2FA} disabled={isLoading}>
                                Disable 2FA
                            </Button>
                        ) : (
                            <Button onClick={handleEnable2FA} disabled={isLoading}>
                                Enable 2FA
                            </Button>
                        )}
                    </div>

                    {is2FAEnabled && (
                        <div className="space-y-4">
                            {/* QR Code */}
                            {totpData.qrCodeUrl && (
                                <div className="flex flex-col items-center">
                                    <img
                                        src={totpData.qrCodeUrl}
                                        alt="QR Code"
                                        className="w-48 h-48 border rounded-md p-2"
                                    />
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Scan this QR code with your authenticator app
                                    </p>
                                </div>
                            )}

                            {/* Manual Entry */}
                            <div>
                                <Label>Secret Key</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Input
                                        value={totpData.secret}
                                        readOnly
                                        className="font-mono"
                                    />
                                    <Button variant="outline" size="icon" onClick={() => {
                                        navigator.clipboard.writeText(totpData.secret);
                                    }}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Or enter this code manually in your authenticator app
                                </p>
                            </div>

                            {/* Current Code */}
                            <div>
                                <Label>Current Verification Code</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Input
                                        value={totpData.currentCode}
                                        readOnly
                                        className="font-mono text-lg font-bold"
                                    />
                                    <Button variant="outline" size="icon" onClick={copyToClipboard}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={fetchCurrentCode}>
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="mt-2">
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 transition-all duration-1000 ease-linear"
                                            style={{ width: `${(totpData.timeRemaining / 30) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1 text-right">
                                        Expires in {totpData.timeRemaining} seconds
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>

                {/* Loading State */}
                {isLoading && (
                    <CardContent className="flex justify-center items-center py-8">
                        <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}

export default Settings;