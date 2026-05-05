'use client';

import { useState } from 'react';
import SplashScreen from '@/components/SplashScreen';
import WeatherDashboard from '@/components/WeatherDashboard';
import { AnimatePresence } from 'motion/react';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <main>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        ) : (
          <WeatherDashboard key="dashboard" />
        )}
      </AnimatePresence>
    </main>
  );
}
