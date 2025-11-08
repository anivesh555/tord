import mongoose, { Schema, Document, Model } from "mongoose";

export type CategoryType =
    | "normal"
    | "couple"
    | "extreme"
    | "superExtreme"
    | "naughty";

export interface ITord extends Document {
    question: string;
    type: "truth" | "dare";
    questionId: number;
    category: CategoryType[]; // ← array of allowed strings
}


const TordSchema = new Schema<ITord>({
    question: { type: String, required: true },
    type: { type: String, required: true, enum: ["truth", "dare"] },
    questionId: { type: Number, required: false, unique: true },
    category: { type: [String], required: true, default: ['normal'], enum: ["normal", 'couple', 'extreme', 'superExtreme', 'naughty'] }

});

// Auto-increment questionId before saving
TordSchema.pre<ITord>("validate", async function (next) {
    if (this.isNew && !this.questionId) {
        const last = await Tord.findOne().sort({ questionId: -1 });
        this.questionId = last ? last.questionId + 1 : 1;
    }
    next();
});


const Tord: Model<ITord> =
    mongoose.models.Tord || mongoose.model<ITord>("Tord", TordSchema);

export default Tord;
