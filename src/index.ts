import "dotenv/config";
import express from "express";
import { connect } from "mongoose";
import path from "path";
import transactionRoutes from "./routes/transactions";

const app = express();
const port = process.env.PORT || 5000;
const url = process.env.MONGODB_URI || "";

app.use(express.json());
app.use(express.static(path.join(__dirname, "client", "build")));
app.use("/api/transactions", transactionRoutes);
app.get("*", (_, res) => {
	res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

connect(url, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
}).then(() => {
	console.log("Database connected");
	app.listen(port, () =>
		console.log(`The server is running on http://localhost:${port}`)
	);
});
