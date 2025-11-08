import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Tord from "@/models/Tord";

// ✅ POST: create new Tord
export async function POST(req: Request) {
    try {
        const { question, type, categories } = await req.json();
        await connectDB();
        console.log(question, type, '==')

        const newTord = await Tord.create({ question, type, category: categories });
        return NextResponse.json({ success: true, data: newTord });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
}

// ✅ GET: get all Tord
export async function GET(req: Request) {
    try {
        await connectDB();
        const filter = {}
        //  need to have in redis
        const query = req.query?.type
        if (query) filter.type = query
        const allTords = await Tord.find(filter).select(["questionId", 'type']);
        let min = 0
        let max = allTords.length
        const randomIndex = Math.floor(Math.random() * max);
        const queryNumber = allTords[randomIndex]
        const randomTords = await Tord.find({ questionId: queryNumber.questionId });


        return NextResponse.json({ success: true, data: randomTords });
    } catch (error: any) {
        console.log(error)
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
