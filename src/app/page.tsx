// src/app/page.tsx
import CookieConsentBanner from "@/lib/cookies/cookie-consent";
import { MainMenu } from "@/components/menu/main";
import { Navbar } from "@/components/menu/main/navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <MainMenu />
        
        {/* Добавляем ссылку на монитор логов */}
        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Мониторинг eBPF логов
          </h2>
          <p className="text-gray-600 mb-6">
            Просматривайте логи сетевых операций в реальном времени
          </p>
          <Link 
            href="/logs"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            Открыть монитор логов
          </Link>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Статус системы</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-700 font-medium">WebSocket сервер</div>
                <div className="text-2xl font-bold text-green-900">Порт 9001</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-700 font-medium">eBPF программа</div>
                <div className="text-2xl font-bold text-blue-900">Загружена</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-700 font-medium">Мониторинг</div>
                <div className="text-2xl font-bold text-purple-900">Активен</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}