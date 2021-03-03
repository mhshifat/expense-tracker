import { Document, model, Schema } from "mongoose";

interface TrancactionDocument {
	date: string;
	description: string;
	category: string;
	type: string;
	amount: number;
	createdAt: string;
}

const TrancactionSchema: Schema = new Schema(
	{
		date: {
			type: Date,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			default: "credit",
		},
		amount: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

type TrancactionModel = TrancactionDocument & Document;

export default model<TrancactionModel>("Trancaction", TrancactionSchema);
