import { Request, Response } from "express";
import Transaction from "../models/Transaction";

export const getTransactions = async (_: Request, res: Response) => {
	try {
		let docs = await Transaction.find({});
		const date = new Date();
		const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		docs = docs.filter(
			(doc) => new Date(doc.date) > firstDay && new Date(doc.date) < lastDay
		);
		let totalCredit = 0;
		let totalDebit = 0;
		docs.forEach((doc) => {
			if (doc.type === "credit") totalCredit += +doc.amount;
			if (doc.type === "debit") totalDebit += +doc.amount;
		});
		return res.status(200).json({
			data: docs,
			totalCredit,
			totalDebit,
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ error: "Something went wrong, please try again later!" });
	}
};

export const getTransaction = async (req: Request, res: Response) => {
	try {
		const docId = req.params.id;
		const doc = await Transaction.findById(docId);
		if (!doc) throw new Error("Transaction not found");
		return res.status(200).json(doc);
	} catch (err) {
		console.error(err);
		return res.status(404).json({ error: err.message });
	}
};

export const createTransaction = async (req: Request, res: Response) => {
	try {
		const { date, description, category, amount } = req.body;
		if (!date || !description || !category || !amount)
			return res.status(422).json({ error: "All fields are required!" });
		const newTransaction = { ...req.body, date: new Date(date).getTime() };
		const doc = new Transaction(newTransaction);
		await doc.save();
		return res.status(200).json(doc);
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ error: "Something went wrong, please try again later!" });
	}
};

export const editTransaction = async (req: Request, res: Response) => {
	try {
		const docId = req.params.id;
		const doc = await Transaction.findById(docId);
		if (!doc) throw new Error("Transaction not found");
		const { date, description, category, amount } = req.body;
		if (!date || !description || !category || !amount)
			return res.status(422).json({ error: "All fields are required!" });
		doc.set({ ...req.body });
		await doc.save();
		return res.status(200).json(doc);
	} catch (err) {
		console.error(err);
		return res.status(404).json({ error: err.message });
	}
};

export const deleteTransaction = async (req: Request, res: Response) => {
	try {
		const docId = req.params.id;
		const doc = await Transaction.findByIdAndRemove(docId);
		if (!doc) throw new Error("Transaction not found");
		return res.status(200).json(doc);
	} catch (err) {
		console.error(err);
		return res.status(404).json({ error: err.message });
	}
};
