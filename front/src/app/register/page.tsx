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

const passwordSchema = z.string()
    .min(12, { message: "Пароль должен содержать минимум 12 символов" })
    .regex(/[A-Z]/, { message: "Должна быть хотя бы одна заглавная буква" })
    .regex(/[a-z]/, { message: "Должна быть хотя бы одна строчная буква" })
    .regex(/[0-9]/, { message: "Должна быть хотя бы одна цифра" })
    .regex(/[^A-Za-z0-9]/, { message: "Должен быть хотя бы один спецсимвол" });

const formSchema = z.object({
    firstname: z.string().min(2, {
        message: "Имя должно содержать не менее 2 символов.",
    }),
    lastname: z.string().min(2, {
        message: "Фамилия должна содержать не менее 2 символов.",
    }),
    email: z.string()
        .min(1, { message: "Введите имя пользователя" })
        .refine(value => !value.includes('@'), {
            message: "Не включайте домен @manuo.com - он будет добавлен автоматически"
        }),
    password: passwordSchema,
});

const PasswordRequirements = ({ password }: { password: string }) => {
    const requirements = [
        { id: 1, text: "Минимум 12 символов", validator: (p: string) => p.length >= 12 },
        { id: 2, text: "Заглавная буква", validator: (p: string) => /[A-Z]/.test(p) },
        { id: 3, text: "Строчная буква", validator: (p: string) => /[a-z]/.test(p) },
        { id: 4, text: "Цифра", validator: (p: string) => /[0-9]/.test(p) },
        { id: 5, text: "Спецсимвол", validator: (p: string) => /[^A-Za-z0-9]/.test(p) },
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

export default function RegistrationForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088';

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: any) => {
        setIsLoading(true);

        try {
            const dataToSend = {
                ...values,
                email: `${values.email}@manuo.com`
            };

            const response = await axios.post(
                `${API_BASE_URL}/api/v1/auth/register`,
                dataToSend,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 202) {
                toast.success("Регистрация успешна! Проверьте свою электронную почту для активации учетной записи.");
                form.reset();
                setPassword("");
            } else {
                toast.error(`Ошибка регистрации: ${response.status} ${response.statusText}`);
            }
        } catch (error: any) {
            console.error("Ошибка регистрации:", error);

            let errorMessage = "Ошибка регистрации. Пожалуйста, проверьте свою информацию и попробуйте еще раз.";


            // if (error.response?.data?.message?.includes('Duplicate entry') ||
            //     error.response?.data?.message?.toLowerCase().includes('email already exists')) {
            //     errorMessage = "Этот email уже зарегистрирован. Пожалуйста, используйте другой email или восстановите пароль.";
            // } else if (error.response?.data?.message) {
            //     errorMessage = error.response.data.message;
            // } else if (error.message) {
            //     errorMessage = error.message;
            // }

            toast.error(errorMessage);

            // form.setError('email', {
            //     type: 'manual',
            //     message: 'Этот email уже зарегистрирован'
            // });
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
                    <h3 className="text-2xl font-semibold tracking-tight">Регистрация</h3>
                    <p className="text-sm text-muted-foreground">
                        Создайте новую учетную запись.
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Имя</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Введите ваше имя" {...field} />
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
                                    <FormLabel>Фамилия</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Введите вашу фамилию" {...field} />
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
                                    <FormLabel>Электронная почта</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder="Введите имя пользователя"
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
                                    <FormLabel>Пароль</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Введите ваш пароль"
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
                                    Регистрируется...
                                </span>
                            ) : "Зарегистрироваться"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}