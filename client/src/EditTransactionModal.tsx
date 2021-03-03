import { Error } from "mongoose";
import React, { FormEvent, Fragment, useState } from "react";
import Modal from "./Modal";

const EditTransactionModal: React.FC<{
	fetchTransactions: () => void;
	transaction: any;
}> = ({ children, fetchTransactions, transaction }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [inputs, setInputs] = useState(transaction);
	const [error, setError] = useState("");

	const emptyFieldFound =
		Object.values(inputs).findIndex((item) => item === "") >= 0 ? true : false;
	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setError("");
		fetch(`/api/transactions/${transaction._id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...inputs, ammount: +inputs.amount }),
		})
			.then((res) => res.json())
			.then(() => {
				fetchTransactions();
				setIsOpen(false);
			})
			.catch((err) => {
				console.error(err);
				setError(err.message);
			});
	};

	return (
		<Fragment>
			{React.cloneElement(children as any, {
				onClick: () => setIsOpen(true),
			})}
			<Modal
				title="Update Transaction"
				open={isOpen}
				closeModal={() => setIsOpen(false)}
			>
				<form onSubmit={handleSubmit}>
					{error && (
						<p className="error">
							<strong>Error: </strong>
							<br /> {Error}
						</p>
					)}
					<input
						type="date"
						value={convertTo(inputs.date)}
						onChange={(e) =>
							setInputs((oldState: any) => ({
								...oldState,
								date: e.target.value,
							}))
						}
						required
					/>
					<textarea
						placeholder="Description"
						value={inputs.description}
						onChange={(e) =>
							setInputs((oldState: any) => ({
								...oldState,
								description: e.target.value,
							}))
						}
						required
					/>
					<select
						value={inputs.category}
						onChange={(e) =>
							setInputs((oldState: any) => ({
								...oldState,
								category: e.target.value,
							}))
						}
						required
					>
						<option>Choose a Category</option>
						<option value="income">Income</option>
						<option value="food">Food</option>
						<option value="transports">Transports</option>
					</select>
					<select
						value={inputs.type}
						onChange={(e) =>
							setInputs((oldState: any) => ({
								...oldState,
								type: e.target.value,
							}))
						}
						required
					>
						<option>Choose a Type</option>
						<option value="credit">Credit</option>
						<option value="debit">Debit</option>
					</select>
					<input
						type="number"
						placeholder="Amount"
						value={inputs.amount}
						onChange={(e) =>
							setInputs((oldState: any) => ({
								...oldState,
								amount: e.target.value,
							}))
						}
						required
					/>

					<div className="form-buttons">
						<button onClick={() => setIsOpen(false)}>Cancel</button>
						<button type="submit" disabled={emptyFieldFound}>
							Update
						</button>
					</div>
				</form>
			</Modal>
		</Fragment>
	);
};

function convertTo(dateStr: string) {
	const date = new Date(dateStr);
	const year = date.getFullYear();
	const mon = date.getMonth();
	const day = date.getDay();

	return `${year}-${mon < 10 ? "0" + mon : mon}-${day < 10 ? "0" + day : day}`;
}

export default EditTransactionModal;
