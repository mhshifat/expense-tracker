import express from "express";
import {
	createTransaction,
	deleteTransaction,
	editTransaction,
	getTransaction,
	getTransactions,
} from "../controllers/transactions";

const router = express.Router();

router.get("/", getTransactions);
router.post("/", createTransaction);
router.get("/:id", getTransaction);
router.put("/:id", editTransaction);
router.delete("/:id", deleteTransaction);

export default router;
