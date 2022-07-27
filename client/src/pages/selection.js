import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import { instance } from "../services/instance";

export default function Selection() {
	const [mangas, setMangas] = useState();
	const [selectValues, setSelectValues] = useState();
	const [error, setError] = useState();

	useEffect(() => {
		instance.get("/mangas/").then((res) => {
			setMangas(res.data);
		});
	}, []);

	const handleSelectValues = (e) => {
		let value = Array.from(e.target.selectedOptions, (option) => option.value);
		setSelectValues(value);
		setError(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (selectValues.length === 5) {
			let ids = [];
			instance.get("/mangas/").then((res) => {
				res.data.map((manga) => {
					if (selectValues.includes(manga.name)) {
						ids.push(manga._id);
						if (ids.length === 5) {
							instance.get("/selection/").then((response) => {
								instance.put(`/selection/${response.data._id}`, { mangas: ids }).then((_) => console.log(_))
							});
						}
					}
				});
			});
		} else {
			setError(true);
		}
	};

	return (
		<div className="create-manga">
			<Navbar />
			<div className="container">
				<div className="form-container">
					<h3 className="title">MODIFIER LA SELECTION</h3>
					<form className="form" onSubmit={handleSubmit}>
						<ul className="links">
							{mangas ? (
								<li>
									<select
										className="manga-selector-selection"
										multiple
										onChange={handleSelectValues}
									>
										{mangas.map((manga) => (
											<option key={manga._id} value={manga.name}>
												{manga.name}
											</option>
										))}
									</select>
								</li>
							) : null}
							<li>
								<button className="btn" type="submit">
									METTRE A JOUR LA SELECTION
								</button>
							</li>
							{error ? (
								<li className="error">Veuillez selectionner 5 mangas.</li>
							) : null}
						</ul>
					</form>
				</div>
			</div>
		</div>
	);
}
