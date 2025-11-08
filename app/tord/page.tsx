"use client";
import { useEffect, useState } from "react";

interface Tord {
    _id?: string;
    question: string;
    type: string;
}

export default function TordPage() {
    const [tords, setTords] = useState<Tord[]>([]);
    const [question, setQuestion] = useState("");
    const [type, setType] = useState("truth");

    // 🔹 Fetch all Tords
    const fetchTords = async () => {
        const res = await fetch("/api/tord");
        const data = await res.json();
        if (data.success) setTords(data.data);
    };

    useEffect(() => {
        fetchTords();
    }, []);

    // 🔹 Create new Tord
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/tord", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, type }),
        });
        const data = await res.json();
        if (data.success) {
            setQuestion("");
            fetchTords();
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: "2rem auto", padding: 20 }}>
            <h2>Create Tord</h2>

            <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
                <input
                    type="text"
                    placeholder="Enter question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                    style={{ padding: 8, width: "100%", marginBottom: 10 }}
                />

                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{ padding: 8, width: "100%", marginBottom: 10 }}
                >
                    <option value="truth">Truth</option>
                    <option value="dare">Dare</option>
                </select>

                <button
                    type="submit"
                    style={{
                        background: "#0070f3",
                        color: "#fff",
                        padding: "8px 16px",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Add
                </button>
            </form>

            <h3>All Entries</h3>
            <ul>
                {tords.map((item) => (
                    <li key={item._id}>
                        <strong>{item.question}</strong> — {item.type.toUpperCase()}
                    </li>
                ))}
            </ul>
        </div>
    );
}
