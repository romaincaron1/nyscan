import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import { instance } from "../services/instance";

export default function AddScan() {
	const [mangas, setMangas] = useState();
	const [selectValue, setSelectValue] = useState();
	const [number, setNumber] = useState("");
	const [images, setImages] = useState();
	const [isUploading, setIsUploading] = useState(false);
	const [uploaded, setUploaded] = useState();
	const bucketUrl = "https://nyscan.s3.eu-west-3.amazonaws.com/";

	useEffect(() => {
		instance.get("/mangas/").then((res) => {
			setMangas(res.data);
		});
	}, []);

	const handleImageChange = (e) => {
		const imagesArray = Array.from(e.target.files);
		setImages(imagesArray);
	};

	const handleSelectChange = (e) => {
		setSelectValue(e.target.value);
		mangas.map((manga) => {
			if (manga.name === e.target.value) {
				setNumber(manga.scans.length + 1);
			}
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsUploading(true);
		if (selectValue !== "" && number !== "" && images) {
			let pages = [];
			let i = 0;
			let tempPages = [];
			images.map((image) => {
				tempPages.push({ imageName: image.name });
			});
			setUploaded(i);
			images.map((image) => {
				const formData = new FormData();
				formData.append("image", image);
				instance.post(`/upload/`, formData).then((res) => {
					const url = `${bucketUrl}${res.data.imagePath}`;
					const scanNumber = parseInt(image.name.slice(5, -4));
					pages.push({ url: url, number: scanNumber });
					setUploaded(i + 1);
					if (images.length === pages.length) {
						setIsUploading(false);
						instance.get("/mangas").then((response) => {
							response.data.map((manga) => {
								if (manga.name === selectValue) {
									pages = pages.sort((a, b) => {
										return a.number - b.number;
									});
									let pagesUrls = [];
									pages.map((page) => {
										pagesUrls.push(page.url);
									});
									instance
										.post("/scans/", {
											manga: manga._id,
											number: number,
											pages: pagesUrls,
										})
										.then((scanResponse) => {
											const newScans = [...manga.scans, scanResponse.data._id];
											instance
												.patch(`/mangas/${manga._id}`, { scans: newScans })
												.then((_) => {
													console.log(_);
												});
										});
								}
							});
						});
					}
					i++;
				});
			});
		}
	};

	const handleNumberChange = (e) => {
		setNumber(e.target.value);
	};

	return (
		<div className="create-manga">
			<Navbar />
			{mangas ? (
				<>
					<div className="container">
						<div className="form-container">
							<h3 className="title">AJOUTER UN CHAPITRE</h3>
							<form className="form" onSubmit={handleSubmit}>
								<ul className="links">
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
									<li>
										<input
											placeholder="Numéro"
											min="0"
											max="10000"
											value={`Chapitre ${number}`}
											disabled
											onChange={handleNumberChange}
										></input>
									</li>
									<input
										className="image"
										type="file"
										name="image"
										accept="image/png, image/jpeg"
										multiple={true}
										onChange={handleImageChange}
									></input>
									<li>
										<button className="btn" type="submit" disabled={isUploading}>
											AJOUTER
										</button>
									</li>
									{isUploading ? (
										<>
											<li>
												<span>Mise en ligne en cours...</span>
											</li>
										</>
									) : null}
									{uploaded ? (
										<>
											<li>
												<span>
													{uploaded}/{images.length} pages mises en ligne.
												</span>
											</li>
											{uploaded === images.length ? (
												<>
													<li>
														<span>Mise en ligne terminée !</span>
													</li>
												</>
											) : null}
										</>
									) : null}
								</ul>
							</form>
						</div>
					</div>
				</>
			) : null}
		</div>
	);
}
