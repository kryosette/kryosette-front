'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { LockKeyhole, Gem, Cpu, Shield, Eye, Code, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const features = [
    {
        icon: <LockKeyhole className="h-5 w-5" strokeWidth={1.5} />,
        title: "Quantum Encryption",
        description: "Unbreakable security protocols using quantum-resistant algorithms",
        href: "/quantum"
    },
    {
        icon: <Gem className="h-5 w-5" strokeWidth={1.5} />,
        title: "Private Wealth",
        description: "Discreet asset management with zero footprint",
        href: "/wealth"
    },
    {
        icon: <Cpu className="h-5 w-5" strokeWidth={1.5} />,
        title: "Neural Privacy",
        description: "AI-powered behavior obfuscation technology",
        href: "/neural"
    },
    {
        icon: <Shield className="h-5 w-5" strokeWidth={1.5} />,
        title: "Zero-Knowledge",
        description: "Verify without revealing any information",
        href: "/zero-knowledge"
    },
    {
        icon: <Eye className="h-5 w-5" strokeWidth={1.5} />,
        title: "Ghost Mode",
        description: "Complete digital invisibility when needed",
        href: "/ghost"
    },
    {
        icon: <Code className="h-5 w-5" strokeWidth={1.5} />,
        title: "Secure API",
        description: "Military-grade integration for your systems",
        href: "/api"
    }
]

export function MainMenu() {
    return (
        <div className="bg-white min-h-screen pt-28 pb-20">
            <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
                {/* Герой секция */}
                <div className="max-w-4xl mx-auto text-center mb-16 px-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-black text-xs font-medium mb-4">
                        EXCLUSIVE PRIVACY NETWORK
                    </span>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-black mb-4">
                        Ultimate Digital<br />
                        <span className="font-medium">Discretion</span>
                    </h1>

                    <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
                        For those who demand absolute privacy without compromise.
                        Your digital life remains exclusively yours.
                    </p>
                </div>

                {/* Сетка фич */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16 px-4">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="bg-white border border-black rounded-lg p-5 hover:shadow-lg transition-shadow mx-auto w-full max-w-md"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-gray-100 text-black">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-medium text-black">
                                    {feature.title}
                                </h3>
                            </div>
                            <p className="text-gray-700 text-sm mb-4">
                                {feature.description}
                            </p>
                            <Link
                                href={feature.href}
                                className="inline-flex items-center text-xs font-medium text-black hover:text-gray-700"
                            >
                                Learn more
                                <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* CTA секция */}
                <div className="bg-white border border-black rounded-lg p-6 md:p-8 max-w-3xl mx-auto">
                    <div className="text-center">
                        <h2 className="text-xl sm:text-2xl font-light text-black mb-3">
                            Ready for <span className="font-medium">absolute privacy</span>?
                        </h2>
                        <p className="text-gray-700 text-sm max-w-xl mx-auto mb-6">
                            Join the most exclusive network of individuals who value their digital sovereignty above all else.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <Button
                                size="sm"
                                className="bg-black text-white hover:bg-gray-800 text-sm"
                            >
                                Request Invitation
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-black text-black hover:bg-gray-100 text-sm"
                            >
                                Speak to Advisor
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}