"use client";
import React, { useEffect, useState } from "react";

import TordPopup from "./TordPopup";
import EditPlayers from "./EditPlayers";

export default function Home() {
    const [players, setPlayers] = useState(() => {
        // Run only in browser
        let stored;
        if (typeof window !== "undefined") {
            stored = localStorage.getItem('players');
        }
        return stored ? JSON.parse(stored) : [];
    });

    const [newName, setNewName] = useState("");
    const [angle, setAngle] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [type, setType] = useState("");
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState(null);
    const [questionType, setQuestionTpe] = useState(null);
    const [popup, setPopup] = useState(false)
    const [popupClosed, setPopupClosed] = useState(false);

    const [showEditor, setShowEditor] = useState(false); // toggle editor popup



    const disableReason = (() => {
        if (spinning) {
            return "Spinning...";
        }
        if (!type) { // Assumes 'type' is an empty string (""), null, or undefined
            return "Select a game type"; // New message for missing type
        }
        if (players.length < 2) {
            return "Add at least 2 players";
        }
        return null; // Not disabled
    })();

    useEffect(() => {
        // Run only in browser
        let stored;
        let gametype;
        if (typeof window !== "undefined") {


            stored = localStorage.getItem("players");
            gametype = localStorage.getItem("gametype");


        }
        if (stored) setPlayers(JSON.parse(stored));
        // console.log(gametype, "==typoew------")
        if (gametype) setType(gametype)
    }, []);

    // ✅ Update localStorage whenever players change
    useEffect(() => {
        // Run only in browser
        if (typeof window !== "undefined") {

            localStorage.setItem("players", JSON.stringify(players));
        }
    }, [players]);
    // console.log(players)
    const addName = () => {
        if (newName.trim() === "") return;
        const updated = [...players, { player: players.length + 1, name: newName.trim() }];
        setPlayers(updated);
        // Run only in browser
        if (typeof window !== "undefined") {
            localStorage.setItem('players', JSON.stringify(updated));
        }
        setNewName("");
    };

    const spinBottle = async () => {
        if (spinning || players.length < 2) return;
        if (!type) return;

        setSpinning(true);
        setResult(null);
        const randomSpin = Math.floor(Math.random() * 360) + 720; // 2+ full spins
        const newAngle = angle + randomSpin;
        setAngle(newAngle);

        // console.log(newAngle, "new angle <<====", randomSpin)

        // Determine winner after spin completes
        setTimeout(() => {
            setSpinning(false);
            const normalizedAngle = (newAngle % 360 + 360) % 360;
            const segmentAngle = 360 / players.length;
            let x = angle
            // for (let player of players) {
            //     console.log(player)
            //     x = x + segmentAngle
            //     if (normalizedAngle > x && normalizedAngle < x + segmentAngle) {
            //         console.log('user found ------', player)
            //     }


            // }

            const index = Math.floor((players.length - normalizedAngle / segmentAngle) % players.length);
            const selected = players[index < 0 ? 0 : index];
            setResult(selected);
            console.log(normalizedAngle, segmentAngle, "=====", selected)
            if (type == 'tord') setPopup(true)
        }, 4000);

        if (type != 'tord') {
            try {
                const res = await fetch(`/api/tord?type=${type}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!res.ok) throw new Error("Failed to start game");



                const data = await res.json();
                // console.log(data, "=======data")
                setQuestion(data.data[0].question)
                setQuestionTpe(data.data[0].type)


            } catch (err) {
                console.error("Error:", err);
                alert("Something went wrong!");
            } finally {
                setLoading(false);
            }
        }
    };


    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {/* Input */}
            <div className="mb-6 flex gap-3">

                <button
                    onClick={() => setShowEditor(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
                >
                    Manage Players
                </button>
            </div>

            <div className="mb-6 flex gap-3 text-black bg-blue border border-gray-200 rounded-lg">

                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{ padding: 8, width: "100%", marginBottom: 10 }}
                >
                    <option value="">Select Game Type</option>

                    <option value="tord">Truth and Dare</option>
                    <option value="truth">Truths Only</option>
                    <option value="dare">Dare Only</option>

                </select>
            </div>


            <div className="relative w-80 h-80 rounded-full border-4 border-blue-400 flex items-center justify-center">
                {/* Arrow */}
                <div
                    className="absolute w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[40px] border-t-red-100"
                    style={{ transform: "translateY(-60px)" }}
                ></div>

                {/* Player Slices */}
                {players.length % 2 === 0 ? (
                    players.map((p: any, i: any) => {
                        // Calculate angles for slices
                        const offset = -90;
                        const angleStart = (i / players.length) * 360 + offset;
                        const angleEnd = ((i + 1) / players.length) * 360 + offset;
                        const angleMid = (angleStart + angleEnd) / 2;
                        const angleRad = (angleMid * Math.PI) / 180;

                        // Calculate player name position
                        const radius = 100;
                        const x = radius * Math.sin(angleRad);
                        const y = -radius * Math.cos(angleRad);

                        return (
                            <React.Fragment key={i}>
                                {/* Slice border lines */}
                                <div
                                    className="absolute w-[2px] h-40 bg-gray-300"
                                    style={{
                                        left: '50%',
                                        top: '50%',
                                        transformOrigin: 'top center',
                                        transform: `rotate(${angleStart}deg)`,
                                    }}
                                />

                                {/* Player name in the middle of their slice */}
                                <div
                                    className="absolute text-sm font-medium text-gray-700"
                                    style={{
                                        left: `calc(50% + ${x}px)`,
                                        top: `calc(50% + ${y}px)`,
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                >
                                    <div>{p.name}</div>
                                </div>
                            </React.Fragment>
                        );
                    })
                ) : (
                    <>
                        {/* Player Slice Borders for Odd Players */}
                        {players.map((_: any, i: any) => {
                            const angleDeg = (i / players.length) * 360;
                            return (
                                <div
                                    key={`line-${i}`}
                                    className="absolute w-[1px] h-40 bg-gray-300 origin-center"
                                    style={{ transform: `rotate(${angleDeg}deg) translateY(-80px)` }}
                                ></div>
                            );
                        })}

                        {/* Player Names for Odd Players */}
                        {players.map((p: any, i: any) => {
                            const angleDeg = (i / players.length) * 360;
                            const radius = 120; // slightly outside the line
                            const x = radius * Math.cos((angleDeg * Math.PI) / 180);
                            const y = radius * Math.sin((angleDeg * Math.PI) / 180);

                            return (
                                <div
                                    key={`name-${i}`}
                                    className="absolute text-sm font-medium text-gray-700 text-left"
                                    style={{
                                        left: `calc(50% + ${x}px)`,
                                        top: `calc(50% + ${y}px)`,
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                >
                                    <div>{p.name}</div>
                                </div>
                            );
                        })}
                    </>
                )}

                {/* Bottle */}
                <div
                    className="absolute flex flex-col items-center origin-center"
                    style={{
                        transform: `rotate(${angle}deg)`,
                        transition: "transform 4s cubic-bezier(0.25, 1, 0.5, 1)",
                    }}
                    onClick={spinBottle}
                >
                    {/* Bottle Neck */}
                    <div className="w-1 h-5 bg-green-700 rounded-t-md"></div>

                    {/* Bottle Body */}
                    <div className="w-6 h-20 bg-gradient-to-b from-green-400 to-green-600 rounded-b-full"></div>
                </div>
            </div>



            {/* Spin Button */}
            <button
                onClick={spinBottle}
                // Button is disabled if a disableReason exists
                disabled={!!disableReason}
                className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 disabled:opacity-50"
            >
                {/* Display the reason if disabled, otherwise show the default text */}
                {disableReason || "Spin Bottle"}
            </button>

            {/* Result */}
            {result && (
                <p className="mt-6 text-lg font-semibold text-gray-800">
                    {/* 🎯 It’s <span className="text-blue-600">Player {'y' || result.player}</span> ({'e' || result.name})! */}
                </p>
            )}
            {question && (
                <p className="mt-6 text-lg font-semibold text-gray-800">
                    🎯 {questionType} <span className="text-blue-600">Player {question}</span>!
                </p>
            )}
            {popup ? (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <TordPopup onClose={() => setPopup(false)} />
                </div>
            ) : <></>}

            {showEditor && (
                <EditPlayers
                    onClose={() => setShowEditor(false)}
                    players={players}
                    setPlayers={setPlayers}
                />
            )}


        </main>
    );
}
