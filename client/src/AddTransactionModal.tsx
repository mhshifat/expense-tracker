import { Error } from "mongoose";
import React, { FormEvent, Fragment, useState } from "react";
import Modal from "./Modal";

const INITIAL_VALUES = {
	date: "",
	description: "",
	category: "",
	type: "",
	amount: "",
};
const AddTransactionModal: React.FC<{ fetchTransactions: () => void }> = ({
	children,
	fetchTransactions,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [inputs, setInputs] = useState(INITIAL_VALUES);
	const [error, setError] = useState("");

	const emptyFieldFound =
		Object.values(inputs).findIndex((item) => item === "") >= 0 ? true : false;
	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setError("");
		fetch("/api/transactions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...inputs, ammount: +inputs.amount }),
		})
			.then((res) => res.json())
			.then(() => {
				fetchTransactions();
				setInputs(INITIAL_VALUES);
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
				title="Create a Transaction"
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
						value={inputs.date}
						onChange={(e) =>
							setInputs((oldState) => ({ ...oldState, date: e.target.value }))
						}
						required
					/>
					<textarea
						placeholder="Description"
						value={inputs.description}
						onChange={(e) =>
							setInputs((oldState) => ({
								...oldState,
								description: e.target.value,
							}))
						}
						required
					/>
					<select
						value={inputs.category}
						onChange={(e) =>
							setInputs((oldState) => ({
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
							setInputs((oldState) => ({
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
							setInputs((oldState) => ({
								...oldState,
								amount: e.target.value,
							}))
						}
						required
					/>

					<div className="form-buttons">
						<button onClick={() => setIsOpen(false)}>Cancel</button>
						<button type="submit" disabled={emptyFieldFound}>
							Save
						</button>
					</div>
				</form>
			</Modal>
		</Fragment>
	);
};

export default AddTransactionModal;
