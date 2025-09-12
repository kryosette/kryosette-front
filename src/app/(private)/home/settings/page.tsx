'use client'

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LogOut, Copy, RefreshCw, Mail, Lock, Bell, Shield, User, Palette, Globe, HelpCircle } from "lucide-react"
import { useState, useEffect } from "react";
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-provider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

function SettingsPage() {
    const { token } = useAuth();
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("account");
    const [totpData, setTotpData] = useState({
        secret: '',
        qrCodeUrl: '',
        currentCode: '',
        timeRemaining: 30
    });

    // Mock data for notifications
    const [notificationSettings, setNotificationSettings] = useState({
        email: true,
        push: true,
        sounds: false,
        marketing: false
    });

    // Mock data for privacy
    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: "public",
        activityStatus: true,
        messageRequests: "friends"
    });

    // Mock data for appearance
    const [appearanceSettings, setAppearanceSettings] = useState({
        theme: "system",
        fontSize: "medium"
    });

    const handleEnable2FA = async () => {
        setIsLoading(true);
        try {
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
            toast.success("2FA enabled successfully");
        } catch (error) {
            toast.error("Failed to enable 2FA");
        } finally {
            setIsLoading(false);
        }
    };

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
            toast.success("2FA disabled successfully");
        } catch (error) {
            toast.error("Failed to disable 2FA");
        } finally {
            setIsLoading(false);
        }
    };

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
            toast.error("Failed to fetch current code");
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(totpData.currentCode);
        toast.success("Code copied to clipboard");
    };

    useEffect(() => {
        if (!is2FAEnabled) return;

        fetchCurrentCode();

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
        <div className="container mx-auto p-4 md:p-6 max-w-6xl">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 shrink-0">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle className="text-xl">Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                                <TabsList className="flex-col h-auto p-0 items-start">
                                    <TabsTrigger value="account" className="w-full justify-start gap-2">
                                        <User className="h-4 w-4" />
                                        Account
                                    </TabsTrigger>
                                    <TabsTrigger value="security" className="w-full justify-start gap-2">
                                        <Shield className="h-4 w-4" />
                                        Security
                                    </TabsTrigger>
                                    <TabsTrigger value="privacy" className="w-full justify-start gap-2">
                                        <Lock className="h-4 w-4" />
                                        Privacy
                                    </TabsTrigger>
                                    <TabsTrigger value="notifications" className="w-full justify-start gap-2">
                                        <Bell className="h-4 w-4" />
                                        Notifications
                                    </TabsTrigger>
                                    <TabsTrigger value="appearance" className="w-full justify-start gap-2">
                                        <Palette className="h-4 w-4" />
                                        Appearance
                                    </TabsTrigger>
                                    <TabsTrigger value="language" className="w-full justify-start gap-2">
                                        <Globe className="h-4 w-4" />
                                        Language
                                    </TabsTrigger>
                                    <TabsTrigger value="help" className="w-full justify-start gap-2">
                                        <HelpCircle className="h-4 w-4" />
                                        Help
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    {/* Account Settings */}
                    {activeTab === "account" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Account Settings
                                </CardTitle>
                                <CardDescription>Manage your profile information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-16 h-16">
                                        <AvatarImage src="https://avatars.githubusercontent.com/u/8884394?v=4" />
                                        <AvatarFallback>DM</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <Button variant="outline">Change Photo</Button>
                                        <p className="text-sm text-muted-foreground">JPG, GIF or PNG. Max size 5MB</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" defaultValue="Dima" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" defaultValue="853" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input id="username" defaultValue="dima853" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" defaultValue="dima853@manuo.com" type="email" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Input id="bio" placeholder="Tell people about yourself" />
                                    <p className="text-sm text-muted-foreground">Max 150 characters</p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button>Save Changes</Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Security Settings */}
                    {activeTab === "security" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Security Settings
                                </CardTitle>
                                <CardDescription>Manage your account security and 2FA</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Password</h3>
                                            <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                                        </div>
                                        <Button variant="outline">Change Password</Button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Two-Factor Authentication</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {is2FAEnabled ? "Enabled" : "Disabled"}
                                            </p>
                                        </div>
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
                                        <div className="space-y-6 pt-4 border-t">
                                            <div className="flex flex-col items-center space-y-4">
                                                <img
                                                    src={totpData.qrCodeUrl}
                                                    alt="QR Code"
                                                    className="w-48 h-48 border rounded-md p-2"
                                                />
                                                <p className="text-sm text-center text-muted-foreground">
                                                    Scan this QR code with your authenticator app
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Secret Key</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        value={totpData.secret}
                                                        readOnly
                                                        className="font-mono"
                                                    />
                                                    <Button variant="outline" size="icon" onClick={() => {
                                                        navigator.clipboard.writeText(totpData.secret);
                                                        toast.success("Secret copied");
                                                    }}>
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Current Verification Code</Label>
                                                <div className="flex items-center gap-2">
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
                                                <div className="mt-2 space-y-1">
                                                    <Progress value={(totpData.timeRemaining / 30) * 100} className="h-2" />
                                                    <p className="text-sm text-muted-foreground text-right">
                                                        Expires in {totpData.timeRemaining} seconds
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t">
                                        <h3 className="font-medium mb-4">Active Sessions</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                                <div>
                                                    <p className="font-medium">Chrome on Windows</p>
                                                    <p className="text-sm text-muted-foreground">Moscow, Russia • Last active 2 hours ago</p>
                                                </div>
                                                <Button variant="destructive" size="sm">Log out</Button>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-lg">
                                                <div>
                                                    <p className="font-medium">Safari on iPhone</p>
                                                    <p className="text-sm text-muted-foreground">Saint Petersburg, Russia • Last active 1 day ago</p>
                                                </div>
                                                <Button variant="destructive" size="sm">Log out</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Privacy Settings */}
                    {activeTab === "privacy" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-5 w-5" />
                                    Privacy Settings
                                </CardTitle>
                                <CardDescription>Control who can see your information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Profile Visibility</h3>
                                            <p className="text-sm text-muted-foreground">Who can see your profile</p>
                                        </div>
                                        <select
                                            className="bg-background border rounded-md px-3 py-2 text-sm"
                                            value={privacySettings.profileVisibility}
                                            onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                                        >
                                            <option value="public">Public</option>
                                            <option value="friends">Friends Only</option>
                                            <option value="private">Private</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Activity Status</h3>
                                            <p className="text-sm text-muted-foreground">Show when you're active</p>
                                        </div>
                                        <Switch
                                            checked={privacySettings.activityStatus}
                                            onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, activityStatus: checked })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Message Requests</h3>
                                            <p className="text-sm text-muted-foreground">Who can message you</p>
                                        </div>
                                        <select
                                            className="bg-background border rounded-md px-3 py-2 text-sm"
                                            value={privacySettings.messageRequests}
                                            onChange={(e) => setPrivacySettings({ ...privacySettings, messageRequests: e.target.value })}
                                        >
                                            <option value="friends">Friends Only</option>
                                            <option value="anyone">Anyone</option>
                                            <option value="none">No One</option>
                                        </select>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <h3 className="font-medium mb-4">Blocked Users</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src="https://github.com/shadcn.png" />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>
                                                    <span>John Doe</span>
                                                </div>
                                                <Button variant="outline" size="sm">Unblock</Button>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src="https://github.com/shadcn.png" />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>
                                                    <span>Jane Smith</span>
                                                </div>
                                                <Button variant="outline" size="sm">Unblock</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button>Save Changes</Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Notification Settings */}
                    {activeTab === "notifications" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Notification Settings
                                </CardTitle>
                                <CardDescription>Customize how you receive notifications</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Email Notifications</h3>
                                            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.email}
                                            onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, email: checked })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Push Notifications</h3>
                                            <p className="text-sm text-muted-foreground">Receive push notifications</p>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.push}
                                            onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, push: checked })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Notification Sounds</h3>
                                            <p className="text-sm text-muted-foreground">Play sounds for notifications</p>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.sounds}
                                            onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, sounds: checked })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Marketing Emails</h3>
                                            <p className="text-sm text-muted-foreground">Receive promotional emails</p>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.marketing}
                                            onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, marketing: checked })}
                                        />
                                    </div>

                                    <div className="pt-4 border-t space-y-4">
                                        <h3 className="font-medium">Notification Types</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span>New Messages</span>
                                                <Switch defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Friend Requests</span>
                                                <Switch defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Comments</span>
                                                <Switch defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Mentions</span>
                                                <Switch defaultChecked />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button>Save Preferences</Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Appearance Settings */}
                    {activeTab === "appearance" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Palette className="h-5 w-5" />
                                    Appearance
                                </CardTitle>
                                <CardDescription>Customize the look and feel</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium mb-3">Theme</h3>
                                        <div className="flex gap-4">
                                            <button
                                                className={`flex flex-col items-center gap-2 p-3 rounded-lg border ${appearanceSettings.theme === "light" ? "border-primary" : "border-transparent"}`}
                                                onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: "light" })}
                                            >
                                                <div className="w-32 h-20 bg-[#f8fafc] border rounded-md overflow-hidden relative">
                                                    <div className="absolute top-0 left-0 right-0 h-4 bg-[#e2e8f0] border-b"></div>
                                                    <div className="absolute top-5 left-2 w-3 h-3 bg-[#cbd5e1] rounded-full"></div>
                                                    <div className="absolute top-5 left-6 w-16 h-2 bg-[#cbd5e1] rounded-full"></div>
                                                </div>
                                                <span>Light</span>
                                            </button>
                                            <button
                                                className={`flex flex-col items-center gap-2 p-3 rounded-lg border ${appearanceSettings.theme === "dark" ? "border-primary" : "border-transparent"}`}
                                                onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: "dark" })}
                                            >
                                                <div className="w-32 h-20 bg-[#020817] border rounded-md overflow-hidden relative">
                                                    <div className="absolute top-0 left-0 right-0 h-4 bg-[#1e293b] border-b border-[#1e293b]"></div>
                                                    <div className="absolute top-5 left-2 w-3 h-3 bg-[#334155] rounded-full"></div>
                                                    <div className="absolute top-5 left-6 w-16 h-2 bg-[#334155] rounded-full"></div>
                                                </div>
                                                <span>Dark</span>
                                            </button>
                                            <button
                                                className={`flex flex-col items-center gap-2 p-3 rounded-lg border ${appearanceSettings.theme === "system" ? "border-primary" : "border-transparent"}`}
                                                onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: "system" })}
                                            >
                                                <div className="w-32 h-20 bg-[#f8fafc] border rounded-md overflow-hidden relative">
                                                    <div className="absolute top-0 left-0 right-0 h-4 bg-[#e2e8f0] border-b"></div>
                                                    <div className="absolute top-5 left-2 w-3 h-3 bg-[#cbd5e1] rounded-full"></div>
                                                    <div className="absolute top-5 left-6 w-16 h-2 bg-[#cbd5e1] rounded-full"></div>
                                                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#020817]"></div>
                                                </div>
                                                <span>System</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div>
                                            <h3 className="font-medium">Font Size</h3>
                                            <p className="text-sm text-muted-foreground">Adjust the text size</p>
                                        </div>
                                        <select
                                            className="bg-background border rounded-md px-3 py-2 text-sm"
                                            value={appearanceSettings.fontSize}
                                            onChange={(e) => setAppearanceSettings({ ...appearanceSettings, fontSize: e.target.value })}
                                        >
                                            <option value="small">Small</option>
                                            <option value="medium">Medium</option>
                                            <option value="large">Large</option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button>Save Changes</Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Language Settings */}
                    {activeTab === "language" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    Language & Region
                                </CardTitle>
                                <CardDescription>Set your preferred language and timezone</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Language</h3>
                                            <p className="text-sm text-muted-foreground">Select your preferred language</p>
                                        </div>
                                        <select className="bg-background border rounded-md px-3 py-2 text-sm">
                                            <option>English</option>
                                            <option>Russian</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                            <option>German</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Timezone</h3>
                                            <p className="text-sm text-muted-foreground">Set your local timezone</p>
                                        </div>
                                        <select className="bg-background border rounded-md px-3 py-2 text-sm">
                                            <option>(GMT+03:00) Moscow</option>
                                            <option>(GMT-05:00) New York</option>
                                            <option>(GMT+00:00) London</option>
                                            <option>(GMT+08:00) Beijing</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">Date Format</h3>
                                            <p className="text-sm text-muted-foreground">How dates are displayed</p>
                                        </div>
                                        <select className="bg-background border rounded-md px-3 py-2 text-sm">
                                            <option>MM/DD/YYYY</option>
                                            <option>DD/MM/YYYY</option>
                                            <option>YYYY-MM-DD</option>
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button>Save Changes</Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Help Settings */}
                    {activeTab === "help" && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <HelpCircle className="h-5 w-5" />
                                    Help & Support
                                </CardTitle>
                                <CardDescription>Get help with your account</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <h3 className="font-medium mb-2">Help Center</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Find answers to common questions in our help center
                                        </p>
                                        <Button variant="outline">Visit Help Center</Button>
                                    </div>

                                    <div className="p-4 rounded-lg">
                                        <h3 className="font-medium mb-2">Contact Support</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Can't find what you're looking for? Contact our support team
                                        </p>
                                        <Button variant="outline">Contact Support</Button>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <h3 className="font-medium mb-3">Account Actions</h3>
                                        <div className="space-y-3">
                                            <Button variant="outline" className="w-full justify-start">
                                                Download Data
                                            </Button>
                                            <Button variant="outline" className="w-full justify-start">
                                                Request Account Info
                                            </Button>
                                            <Button variant="destructive" className="w-full justify-start">
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;