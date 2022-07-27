import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import { instance } from "../services/instance";

export default function CreateManga() {
	const [name, setName] = useState("");
	const [author, setAuthor] = useState("");
	const [synopsis, setSynopsis] = useState("");
	const [imageFile, setImageFile] = useState();
	const [error, setError] = useState(false);
	const [newManga, setNewManga] = useState();
	const [postedImage, setPostedImage] = useState();
	const [submitted, setSubmitted] = useState();
	const bucketUrl = "https://nyscan.s3.eu-west-3.amazonaws.com/";

	const handleNameChange = (e) => {
		setName(e.target.value);
		setError(false);
	};

	const handleAuthorChange = (e) => {
		setAuthor(e.target.value);
		setError(false);
	};

	const handleSynopsisChange = (e) => {
		setSynopsis(e.target.value);
		setError(false);
	};

	const handleImageChange = (e) => {
		setImageFile(e.target.files[0]);
		setError(false);
	};

	const handleSubmit = async (e) => {
		setSubmitted(true);
		e.preventDefault();
		if (
			name !== "" &&
			author !== "" &&
			synopsis !== "" &&
			imageFile !== undefined
		) {
			const formData = new FormData();
			formData.append("image", imageFile);
			instance.post(`/upload/`, formData).then((res) => {
				const url = `${bucketUrl}${res.data.imagePath}`;

				instance
					.post("/mangas/", {
						name: name,
						author: author,
						image: url,
						synopsis: synopsis,
					})
					.then((res) => {
						instance
							.post("/stats/", { manga: res.data._id })
							.then((_) => {
								setSubmitted(false);
								setNewManga(res.data);
								setPostedImage(url);
							})
							.catch((err) => console.log(err));
					})
					.catch((err) => {
						console.log(err);
					});
			});
		} else {
			setError(true);
		}
	};

	const handleCreateNew = () => {
		setName("");
		setAuthor("");
		setSynopsis("");
		setImageFile("");
		setError();
		setNewManga();
		setPostedImage();
		setSubmitted(false);
	}

	return (
		<div className="create-manga">
			<Navbar />
			<div className="container">
				<div className="form-container">
					<h3 className="title">AJOUTER UN MANGA</h3>
					<form className="form" onSubmit={handleSubmit}>
						<ul className="links">
							<li>
								<input
									type="text"
									value={name}
									onChange={handleNameChange}
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
							<input
								className="image"
								type="file"
								name="image"
								accept="image/png, image/jpeg"
								onChange={handleImageChange}
							></input>
							{error ? (
								<>
									<li className="error">Veuillez remplir tous les champs</li>
								</>
							) : null}
							<li>
								<button className="btn" type="submit">
									AJOUTER
								</button>
							</li>
							{submitted ? <li>En cours de mise en ligne...</li> : null}
						</ul>
					</form>
				</div>
				{newManga ? (
					<div className="new-manga">
						<ul>
							<li>Nom : {name}</li>
							<li>Auteur : {author}</li>
							<li>Synopsis : {synopsis}</li>
							<li>
								<Link className="btn" to={`/dashboard`}>
									Revenir au dashboard
								</Link>
							</li>
							<li>
								<Link className="btn" to={'/manga/create'} onClick={handleCreateNew}>
									Ajouter un nouveau manga
								</Link>
							</li>
							{postedImage ? (
								<>
									<li>
										<img src={postedImage} alt="" width="200px" />
									</li>
								</>
							) : null}
						</ul>
					</div>
				) : null}
			</div>
		</div>
	);
}
