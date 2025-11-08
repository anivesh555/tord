"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createOrGetSession } from "@/lib/session";

export default function Home() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const gameTypes = ["Truth or Dare", "Dare Only", "Truth only"];

  useEffect(() => {
    const sessionId = createOrGetSession();
    console.log("Session ID:", sessionId);
  }, []);

  const handlePlay = () => {
    if (!selectedGame) {
      alert("Please select a game type!");
      return;
    }
    router.push(`/play?type=${encodeURIComponent(selectedGame)}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Welcome
      </h1>

      <div className="flex flex-col gap-4 mb-8">
        {gameTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedGame(type)}
            className={`px-6 py-3 rounded-lg border transition ${selectedGame === type
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      <button
        onClick={handlePlay}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Play
      </button>
    </div>
  );
}


// todo - Edit players (may be in popUp with reset button)
//      - deployment ()db
//    - t or d question popup
//    - add question category- multiple type question
//   - add filter  category type of qsn
