// pages/index.jsx
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Динамически импортируем компонент (SSR не требуется)
const LogMonitor = dynamic(() => import('../components/LogMonitor'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Загрузка монитора логов...</div>
    </div>
  )
});

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<div>Загрузка...</div>}>
        <LogMonitor />
      </Suspense>
    </>
  );
}