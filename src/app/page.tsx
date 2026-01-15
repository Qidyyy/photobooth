'use client';

import { StartScreen } from "@/components/StartScreen";
import { useState } from "react";


export default function Home() {
  const [started, setStarted] = useState(false);

  const handleUseCamera = () => {
    console.log("Starting camera session...");
    setStarted(true);
    // TODO: Transition to camera view
  };

  const handleUpload = () => {
    console.log("Starting upload session...");
    // TODO: Implement upload flow
    alert("Upload feature coming soon!");
  };

  return (
    <main className="min-h-screen p-4 flex items-center justify-center">
      {!started ? (
        <StartScreen onUseCamera={handleUseCamera} onUpload={handleUpload} />
      ) : (
        <div className="text-center font-serif text-2xl">Camera View Placeholder</div>
      )}
    </main>
  );
}
