'use client'
import React, { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Lock, Server, Cpu, Shield, EyeOff, Code2 } from 'lucide-react'
import Link from 'next/link'

// Анимированный "червоточинный" фон
function WormholeEffect() {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const radius = useMotionValue(0)
    const opacity = useMotionValue(0)

    const handleMouseMove = (e: React.MouseEvent) => {
        const bounds = e.currentTarget.getBoundingClientRect()
        mouseX.set(e.clientX - bounds.left)
        mouseY.set(e.clientY - bounds.top)
        radius.set(Math.sqrt(bounds.width ** 2 + bounds.height ** 2) / 2)
        animate(opacity, 1, { duration: 0.5 })
    }

    const background = useMotionTemplate`
    radial-gradient(
      circle ${radius}px at ${mouseX}px ${mouseY}px,
      rgba(59, 130, 246, 0.15),
      transparent 80%
    )
  `

    return (
        <motion.div
            className="absolute inset-0 overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => animate(opacity, 0)}
            style={{ opacity }}
        >
            <motion.div
                className="absolute inset-0"
                style={{
                    background,
                }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black/80 to-black" />
        </motion.div>
    )
}

// Карточка фичи
const FeatureCard = ({ icon, title, desc, href, delay }: {
    icon: React.ReactNode
    title: string
    desc: string
    href: string
    delay: number
}) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay * 0.15, type: 'spring' }}
        whileHover={{ y: -10 }}
        className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-black to-gray-900/50 p-6 shadow-2xl"
    >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-900/20 text-blue-400">
                {icon}
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
            <p className="text-gray-400">{desc}</p>
            <Button
                variant="ghost"
                className="mt-4 text-blue-400 hover:text-white"
                asChild
            >
                <Link href={href}>
                    <span>Explore</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="ml-2 h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </Link>
            </Button>
        </div>
    </motion.div>
)

export function MainMenu() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-black">
            {/* Эффект червоточины */}
            <WormholeEffect />

            {/* Центральный "портал" */}
            <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"
                />
                <motion.div
                    animate={{
                        rotate: 360,
                        transition: { duration: 20, repeat: Infinity, ease: "linear" }
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="h-64 w-64 rounded-full border-2 border-dashed border-blue-400/30" />
                </motion.div>
            </div>

            {/* Контент */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20">
                {/* Заголовок */}
                <div className="mb-12 text-center">
                    <motion.span
                        className="mb-4 inline-block rounded-full bg-blue-900/20 px-4 py-1 text-sm font-medium text-blue-400"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6, type: 'spring' }}
                    >
                        WELCOME TO THE VOID
                    </motion.span>
                    <h1 className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-5xl font-bold leading-tight text-transparent sm:text-7xl">
                        KRYOSETTE
                    </h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mx-auto mt-6 max-w-2xl text-xl text-gray-400"
                    >
                        Социальная сеть нового поколения, где ваши данные исчезают быстрее, чем мысли
                    </motion.p>
                </div>

                {/* Карточки фич */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <FeatureCard
                        icon={<Lock className="h-6 w-6" />}
                        title="Quantum Encryption"
                        desc="Шифрование на квантовых алгоритмах"
                        href="/quantum"
                        delay={0}
                    />
                    <FeatureCard
                        icon={<Server className="h-6 w-6" />}
                        title="Dark Nodes"
                        desc="Децентрализованная сеть на Tor-нодах"
                        href="/nodes"
                        delay={1}
                    />
                    <FeatureCard
                        icon={<Cpu className="h-6 w-6" />}
                        title="Neural Obfuscation"
                        desc="ИИ маскирует ваши паттерны"
                        href="/ai"
                        delay={2}
                    />
                    <FeatureCard
                        icon={<Shield className="h-6 w-6" />}
                        title="Zero-Knowledge"
                        desc="Доказательства без раскрытия данных"
                        href="/zk"
                        delay={3}
                    />
                    <FeatureCard
                        icon={<EyeOff className="h-6 w-6" />}
                        title="Ghost Mode"
                        desc="Полное исчезновение из сети"
                        href="/ghost"
                        delay={4}
                    />
                    <FeatureCard
                        icon={<Code2 className="h-6 w-6" />}
                        title="API для параноиков"
                        desc="Интеграция с вашими системами"
                        href="/api"
                        delay={5}
                    />
                </div>

                {/* Кнопка CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="mt-20 text-center"
                >
                    <Button
                        size="xl"
                        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-lg font-bold shadow-lg"
                    >
                        <span className="relative z-10">Провалиться в бездну</span>
                        <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 hover:opacity-100"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '0%' }}
                            transition={{ duration: 0.6 }}
                        />
                    </Button>
                </motion.div>
            </div>

            {/* Эффект частиц */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-blue-400/30"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            width: Math.random() * 4 + 1,
                            height: Math.random() * 4 + 1,
                            opacity: 0
                        }}
                        animate={{
                            y: [null, (Math.random() - 0.5) * 100],
                            opacity: [0, 0.3, 0]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 5,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>
        </div>
    )
}