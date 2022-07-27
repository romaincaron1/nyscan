import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import { instance } from "../services/instance";

export default function EditManga() {
	const [name, setName] = useState("");
	const [author, setAuthor] = useState("");
	const [synopsis, setSynopsis] = useState("");
	const [mangas, setMangas] = useState();
	const [selectValue, setSelectValue] = useState();
	const [error, setError] = useState(false);
	const [modified, setModified] = useState(false);

	useEffect(() => {
		instance.get("/mangas/").then((res) => {
			setMangas(res.data);
		});
	}, []);

	const handleChangeName = (e) => {
		setName(e.target.value);
	};

	const handleSelectChange = (e) => {
		setSelectValue(e.target.value);
	};

	const handleAuthorChange = (e) => {
		setAuthor(e.target.value);
		setError(false);
	};

	const handleSynopsisChange = (e) => {
		setSynopsis(e.target.value);
		setError(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		let newValues = {};

		if (name) {
			newValues["name"] = name;
		}
		if (author) {
			newValues["auhor"] = author;
		}
		if (synopsis) {
			newValues["synopsis"] = synopsis;
		}

		if (selectValue && (name || author || synopsis)) {
			instance.get("/mangas/").then((res) => {
				res.data.map((manga) => {
					if (manga.name === selectValue) {
						instance
							.patch(`/mangas/${manga._id}`, newValues)
							.then((response) => setModified(true));
					}
				});
			});
		}
	};

	return (
		<div className="create-manga">
			<Navbar />
			<div className="container">
				<div className="form-container">
					<h3 className="title">MODIFIER UN MANGA</h3>
					<form className="form" onSubmit={handleSubmit}>
						<ul className="links">
							{mangas ? (
								<>
									<li>
										<select
											className="manga-selector"
											value={selectValue}
											onChange={handleSelectChange}
										>
											<option value="">CHOISIR UN MANGA</option>
											{mangas.map((manga) => {
												return (
													<option key={manga._id} value={manga.name}>
														{manga.name}
													</option>
												);
											})}
										</select>
									</li>
								</>
							) : null}
							<li>
								<input
									type="text"
									value={name}
									onChange={handleChangeName}
									placeholder="Nom du manga"
								></input>
							</li>
							<li>
								<input
									type="text"
									value={author}
									onChange={handleAuthorChange}
									placeholder="Auteur du manga"
								></input>
							</li>
							<li>
								<textarea
									maxLength={1000}
									value={synopsis}
									onChange={handleSynopsisChange}
									placeholder="Synopsis"
								></textarea>
							</li>
							{error ? (
								<>
									<li className="error">Veuillez remplir tous les champs</li>
								</>
							) : null}
							<li>
								<button className="btn" type="submit">
									MODIFIER
								</button>
							</li>
							{modified ? (
								<>
									<li>
										<span>Manga modifié !</span>
									</li>
								</>
							) : null}
						</ul>
					</form>
				</div>
			</div>
		</div>
	);
}
