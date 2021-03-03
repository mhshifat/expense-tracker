import React, { Fragment, useEffect, useState } from "react";
import AddTransactionModal from "./AddTransactionModal";
import EditTransactionModal from "./EditTransactionModal";

function App() {
	const [transactions, setTransactions] = useState([]);
	const [totalCredit, setTotalCredit] = useState(0);
	const [totalDebit, setTotalDebit] = useState(0);

	useEffect(() => {
		fetchTransactions();
	}, []);

	const fetchTransactions = () => {
		fetch("/api/transactions", {
			method: "GET",
		})
			.then((res) => res.json())
			.then((res) => {
				setTransactions(res.data);
				setTotalCredit(res.totalCredit);
				setTotalDebit(res.totalDebit);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const deleteTransaction = (id: string) => {
		fetch(`/api/transactions/${id}`, {
			method: "DELETE",
		})
			.then((res) => res.json())
			.then((data) => {
				fetchTransactions();
			})
			.catch((err) => {
				console.error(err);
			});
	};

	return (
		<div className="main">
			<div className="header">
				<span>
					Total Debit: <strong>{totalCredit}</strong>
				</span>
				<span>
					Total Credit: <strong>{totalDebit}</strong>
				</span>
			</div>
			<AddTransactionModal fetchTransactions={fetchTransactions}>
				<button className="add-btn">+</button>
			</AddTransactionModal>
			<table>
				<tbody>
					{transactions.map((transaction: any) => (
						<Fragment key={transaction._id}>
							<tr>
								<td>{convertToDateStr(transaction.date)}</td>
								<td>
									<div className="catagory">{transaction.category}</div>
								</td>
								<td>${transaction.amount}</td>
								<td>
									<span>
										<EditTransactionModal
											fetchTransactions={fetchTransactions}
											transaction={transaction}
										>
											<button>&#x270E;</button>
										</EditTransactionModal>
										<button onClick={() => deleteTransaction(transaction._id)}>
											&times;
										</button>
									</span>
								</td>
							</tr>
							<tr className="empty"></tr>
						</Fragment>
					))}
				</tbody>
			</table>
		</div>
	);
}

function convertToDateStr(dateStr: string) {
	const date = new Date(dateStr);
	const day = date.getDay();
	const mon = date.toLocaleString("default", { month: "short" });
	const year = date.getFullYear();
	return `${day} ${mon}, ${year}`;
}

export default App;
