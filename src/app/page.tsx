"use client"

import dynamic from 'next/dynamic';

const Board = dynamic(() => import('@/components/board/Board'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="h-[100dvh] w-screen overflow-hidden bg-background">
      <Board />
    </main>
  );
}
