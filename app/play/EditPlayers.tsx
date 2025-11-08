"use client";
import { useState, useEffect } from "react";

interface EditPlayersProps {
    onClose: () => void;
    players: { id: number; name: string }[];
    setPlayers: React.Dispatch<
        React.SetStateAction<{ id: number; name: string }[]>
    >;
}

export default function EditPlayers({ onClose, players, setPlayers }: EditPlayersProps) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newName, setNewName] = useState("");
    const [nameToAdd, setNameToAdd] = useState("");

    const startEditing = (id: number, name: string) => {
        setEditingId(id);
        setNewName(name);
    };

    const saveEdit = () => {
        setPlayers((prev) =>
            prev.map((p) => (p.id === editingId ? { ...p, name: newName } : p))
        );
        setEditingId(null);
        setNewName("");
    };

    const addPlayer = () => {
        if (!nameToAdd.trim()) return;
        const newPlayer = { id: Date.now(), name: nameToAdd.trim() };
        setPlayers((prev) => [...prev, newPlayer]);
        setNameToAdd("");
    };

    const deletePlayer = (id: number) => {
        setPlayers((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 text-black">
            <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                <h2 className="text-2xl font-bold mb-4">Edit Players</h2>

                {/* Add Player */}
                <div className="flex mb-4">
                    <input
                        value={nameToAdd}
                        onChange={(e) => setNameToAdd(e.target.value)}
                        placeholder="New player name"
                        className="border rounded-l px-3 py-2 flex-1"
                    />
                    <button
                        onClick={addPlayer}
                        className="bg-green-600 text-white px-3 rounded-r"
                    >
                        Add
                    </button>
                </div>

                {/* List of Players */}
                <ul>
                    {players.map((player) => (
                        <li
                            key={player.id}
                            className="flex justify-between items-center mb-2 bg-gray-100 rounded px-3 py-2"
                        >
                            {editingId === player.id ? (
                                <>
                                    <input
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="border rounded px-2 py-1 flex-1 mr-2"
                                    />
                                    <button
                                        onClick={saveEdit}
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                    >
                                        Save
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span>{player.name}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEditing(player.id, player.name)}
                                            className="text-blue-500 underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deletePlayer(player.id)}
                                            className="text-red-500 underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>

                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-gray-400 text-white py-2 rounded-lg"
                >
                    Done
                </button>
            </div>
        </div>
    );
}
