'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from 'sonner';
import { Check, X } from 'lucide-react';

const BACKEND_URL = "http://localhost:8088";

/**
 * Password validation schema using Zod
 * 
 * @constant
 * @type {z.ZodString}
 * 
 * @description
 * Defines password requirements:
 * - Minimum 12 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const passwordSchema = z.string()
    .min(12, { message: "Password must contain at least 12 characters" })
    .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Must contain at least one special character" });

/**
 * Form validation schema using Zod
 * 
 * @constant
 * @type {z.ZodObject}
 * 
 * @description
 * Defines form validation rules for:
 * - First name (min 2 characters)
 * - Last name (min 2 characters)
 * - Email (username without domain)
 * - Password (validated by passwordSchema)
 */
const formSchema = z.object({
    firstname: z.string().min(2, {
        message: "First name must contain at least 2 characters",
    }),
    lastname: z.string().min(2, {
        message: "Last name must contain at least 2 characters",
    }),
    email: z.string()
        .min(1, { message: "Please enter a username" })
        .refine(value => !value.includes('@'), {
            message: "Do not include @manuo.com domain - it will be added automatically"
        }),
    password: passwordSchema,
});

/**
 * PasswordRequirements Component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.password - Current password value to validate
 * 
 * @description
 * Displays password requirements with visual validation indicators.
 * Shows checkmarks for met requirements and X's for unmet ones.
 */
const PasswordRequirements = ({ password }: { password: string }) => {
    const requirements = [
        { id: 1, text: "Minimum 12 characters", validator: (p: string) => p.length >= 12 },
        { id: 2, text: "Uppercase letter", validator: (p: string) => /[A-Z]/.test(p) },
        { id: 3, text: "Lowercase letter", validator: (p: string) => /[a-z]/.test(p) },
        { id: 4, text: "Number", validator: (p: string) => /[0-9]/.test(p) },
        { id: 5, text: "Special character", validator: (p: string) => /[^A-Za-z0-9]/.test(p) },
    ];

    return (
        <div className="mt-2 space-y-1">
            {requirements.map(req => (
                <div key={req.id} className="flex items-center text-sm">
                    {req.validator(password) ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <span className={req.validator(password) ? "text-green-500" : "text-muted-foreground"}>
                        {req.text}
                    </span>
                </div>
            ))}
        </div>
    );
};

/**
 * RegistrationForm Component
 * 
 * @component
 * 
 * @description
 * Handles user registration with:
 * - Form validation using Zod
 * - Password strength visualization
 * - API integration for registration
 * - Loading states
 * - Success/error feedback
 * 
 * @state {boolean} isLoading - Loading state during submission
 * @state {string} password - Current password value for validation display
 * @state {boolean|null} emailAvailable - Email availability status (not currently used)
 */
export default function RegistrationForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
        },
    });

    /**
     * Handles form submission
     * 
     * @async
     * @param {Object} values - Form values
     * 
     * @description
     * - Sets loading state
     * - Constructs full email with domain
     * - Makes API request to registration endpoint
     * - Handles success/error responses
     * - Shows appropriate toast notifications
     * - Resets form on success
     */
    const onSubmit = async (values: any) => {
        setIsLoading(true);

        try {
            const dataToSend = {
                ...values,
                email: `${values.email}@manuo.com`
            };

            const response = await axios.post(
                `${BACKEND_URL}/api/v1/auth/register`,
                dataToSend,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 202) {
                toast.success("Registration successful! Please check your email to activate your account.");
                form.reset();
                setPassword("");
            } else {
                toast.error(`Registration error: ${response.status} ${response.statusText}`);
            }
        } catch (error: any) {
            const errorMessage = "Registration error. Please check your information and try again.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container max-w-2xl mx-auto py-12">
            <Toaster richColors />
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                    <p className='flex justify-center font-bold'>manuo</p>
                    <h3 className="text-2xl font-semibold tracking-tight">Create Account</h3>
                    <p className="text-sm text-muted-foreground">
                        Create a new account to get started
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="Enter username"
                                                {...field}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/@manuo\.com$/, '');
                                                    field.onChange(value);
                                                }}
                                            />
                                            <span className="absolute right-3 top-2 text-muted-foreground">
                                                @manuo.com
                                            </span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your password"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setPassword(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    <PasswordRequirements password={password} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registering...
                                </span>
                            ) : "Create Account"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}