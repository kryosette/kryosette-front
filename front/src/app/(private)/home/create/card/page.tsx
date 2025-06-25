// components/CreateCardForm.tsx
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
    cardNumber: z.string().min(16, {
        message: "Card number must be at least 16 characters.",
    }),
    expiryDate: z.string().min(4, {
        message: "Expiry date must be in MM/YY format.",
    }),
    cvv: z.string().min(3, {
        message: "CVV must be 3 digits.",
    }),
})

const BACKEND_URL = "http://localhost:8088"

interface CreateCardFormProps {
    onCreate: () => void;
}

function CreateCardForm({ onCreate }: CreateCardFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cardNumber: "",
            expiryDate: "",
            cvv: "",
        },
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            // Send request to your Spring Boot backend to create a card
            const response = await fetch(`${BACKEND_URL}/api/v1/card/create`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                    // Include authorization token if needed
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                console.log("Card created successfully!");
                onCreate(); // Call the callback to refresh the card list
            } else {
                console.error("Failed to create card");
            }
        } catch (error) {
            console.error("Error creating card:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-[500px]">
            <CardHeader>
                <CardTitle>Create a New Card</CardTitle>
                <CardDescription>Enter the card details below.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Card Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="XXXX-XXXX-XXXX-XXXX" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expiryDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <FormControl>
                                        <Input placeholder="MM/YY" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CVV</FormLabel>
                                    <FormControl>
                                        <Input placeholder="XXX" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Card"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default CreateCardForm;