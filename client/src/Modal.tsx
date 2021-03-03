import React from "react";

const Modal: React.FC<{
	title: string;
	open?: boolean;
	closeModal?: () => void;
}> = ({ children, title, open, closeModal }) => {
	if (!open) return null;
	return (
		<div className="modal-wrapper">
			<div className="modal">
				<div className="modal-header">
					<h3>{title}</h3>
					<button onClick={closeModal}>&times;</button>
				</div>
				<div className="modal-body">{children}</div>
			</div>
		</div>
	);
};

export default Modal;
