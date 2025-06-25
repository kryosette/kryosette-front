'use client'

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/lib/auth-provider";
import Modal from 'react-modal';

interface Transactions {
    senderEmail: string;
    recipientUserId: number;
    amount: number
}

const formSchema = z.object({
    recipientUserId: z.string().min(1, {
        message: "Recipient User ID must be valid.",
    }),
    amount: z.string().min(1, {
        message: "Amount must be a valid number.",
    }),
});

function TransferForm() {
    const [isPending, startTransition] = React.useTransition();
    const [transactionData, setTransactionData] = useState(null);
    const { token } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [transferDetails, setTransferDetails] = useState<Transactions | null>(null)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            recipientUserId: "",
            amount: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                const response = await fetch("http://localhost:8088/api/v1/bank_account/transfer", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        recipientUserId: Number(values.recipientUserId),
                        amount: Number(values.amount),
                    }),
                });

                if (!response.ok) {
                    const message = await response.text();
                    toast.error(message || "Transfer failed");
                    return;
                }

                form.reset();
                setShowModal(true);
                toast.success("Funds have been transferred");
                const jsonData = await response.json();

                setTransactionData(jsonData);
            } catch (error: any) {
                toast.error(error.message || "Transfer has failed");
            }
        });
    }

    const closeModal = () => {
        setShowModal(false);
        setTransferDetails(null); // Clear transfer details when closing the modal
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="recipientUserId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Recipient User ID</FormLabel>
                            <FormControl>
                                <Input placeholder="Recipient User ID" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input placeholder="Amount" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Transferring..." : "Transfer Funds"}
                </Button>
            </form>
            <Modal
                data={transactionData}
                isOpen={showModal}
                onRequestClose={closeModal}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        width: '90%',
                    }
                }}
            >
                <h2>Transfer Successful!</h2>
                <p>Transaction ID: {transferDetails?.amount}</p>
                <p>Recipient: {transferDetails?.recipientUserId}</p>
                <p>Amount: {transferDetails?.senderEmail}</p>
                <button onClick={closeModal}>Close</button>
            </Modal>
        </Form>
    );
}

export default TransferForm;