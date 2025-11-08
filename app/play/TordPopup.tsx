"use client";
import { useState } from "react";

interface TordPopupProps {
    onClose: () => void;
}

export default function TordPopup({ onClose }: TordPopupProps) {
    const [showPopup, setShowPopup] = useState(true);
    const [question, setQuestion] = useState<string | null>(null);
    const [questionType, setQuestionType] = useState<string | null>(null);

    // 🔥 make it async
    const handleLieOrguts = async (choice: string) => {
        try {
            const res = await fetch(`/api/tord?type=${choice}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Failed to get question");

            const data = await res.json();
            // console.log(data, "=======data");

            setQuestion(data.data[0].question);
            setQuestionType(data.data[0].type);
        } catch (err) {
            console.error("Error:", err);
            alert("Something went wrong!");
        }
    };

    const handleCancel = () => {
        setShowPopup(false);
        onClose();
    };

    if (!showPopup) return null;

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl p-6 shadow-lg w-80 text-center">
                {!question ? (
                    <>
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">
                            Choose your action
                        </h2>
                        <div className="flex justify-around">
                            <button
                                onClick={() => handleLieOrguts("truth")}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                            >
                                Lie
                            </button>
                            <button
                                onClick={() => handleLieOrguts("dare")}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                            >
                                Guts
                            </button>
                        </div>
                        <button
                            onClick={handleCancel}
                            className="mt-4 text-gray-600 underline text-sm"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">
                            {questionType?.toUpperCase()}
                        </h2>
                        <p className="text-gray-700">{question}</p>
                        <button
                            onClick={handleCancel}
                            className="mt-4 text-gray-600 underline text-sm"
                        >
                            Close
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
