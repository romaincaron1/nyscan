import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import NotFound from "../components/not_found";
import { Link } from "react-router-dom";
import Auth from "../contexts/Auth";
import { getMe } from "../services/ApiCalls";
import { instance } from "../services/instance";
import { updateItem } from "../services/storage";

const Manga = () => {
	const navigate = useNavigate();
	var { id } = useParams();
	const { isAuthenticated } = useContext(Auth);
	const [manga, setManga] = useState();
	const [last, setLast] = useState();
	const [selectValue, setSelectValue] = useState();
	const [inMyList, setInMyList] = useState(false);
	const [user, setUser] = useState();
	const [error, setError] = useState();

	useEffect(() => {
		instance
			.get(`/mangas/${id}`)
			.then((res) => {
				setManga(res.data);
				setLast(res.data.scans.length);
				if (isAuthenticated) {
					getMe().then((response) => {
						setUser(response);
						if (response.list.includes(res.data._id)) {
							setInMyList(true);
						}
					});
				}
			})
			.catch(() => {
				setError(true);
			});
	}, []);

	const handleChange = (e) => {
		setSelectValue(e.target.value);
		navigate(`/manga/${id}/${e.target.value}/1`);
	};

	const handleAddListClick = () => {
		setInMyList(true);
		const newList = [...user.list, manga._id];
		instance.patch("/users/", { list: newList }).then((res) => {
			instance.get(`/stats/${manga._id}`).then((response) => {
				instance
					.patch("/stats/", { manga: manga._id, likes: response.data.likes + 1 })
					.then((_) => {
						updateItem("x-auth-token", res.data);
					});
			});
		});
	};

	const handleDeleteListClick = () => {
		setInMyList(false);
		let newList = user.list;
		newList = newList.filter((item) => item !== manga._id);
		instance.patch("/users/", { list: newList }).then((res) => {
			instance.get(`/stats/${manga._id}`).then((response) => {
				instance
					.patch("/stats/", { manga: manga._id, likes: response.data.likes - 1 })
					.then((_) => {
						updateItem("x-auth-token", res.data);
					});
			});
		});
	};

	var scans = [];
	for (var i = 1; i < parseInt(last) + 1; i++) {
		scans.push(
			<option key={i} value={i}>
				{i}
			</option>
		);
	}

	return (
		<>
			{error ? (
				<NotFound />
			) : (
				<>
					{manga ? (
						<>
							{user ? (
								<div className="manga">
									<Navbar />
									<div className="container">
										<div className="manga-title">
											{manga.name} - {manga.author}
										</div>
										<div className="manga-container">
											<p className="synopsis">
												<img src={manga.image} alt={manga.name} />
												<span>{manga.synopsis}</span>
											</p>
										</div>
										<div className="chapters">
											<div className="btns">
												{last ? (
													<>
														{last !== 1 ? (
															<>
																<Link className="btn" to={`/manga/${id}/1/1`}>
																	<span>1</span>
																</Link>
																<Link className="btn" to={`/manga/${id}/${last}/1`}>
																	<span>{last}</span>
																</Link>
															</>
														) : (
															<>
																<Link className="btn" to={`/manga/${id}/1/1`}>
																	<span>1</span>
																</Link>
															</>
														)}
													</>
												) : null}
												<button
													className="btn"
													onClick={inMyList ? handleDeleteListClick : handleAddListClick}
												>
													<i className={inMyList ? "bx bx-minus" : "bx bx-plus"}></i>
												</button>
											</div>
											<select
												name="pages"
												className="chap-selector"
												id="page-select"
												onChange={handleChange}
												value={selectValue}
											>
												<option value="">CHOISIR UN CHAPITRE</option>
												{scans.map((scan) => {
													return scan;
												})}
											</select>
										</div>
									</div>
									<Footer />
								</div>
							) : (
								<>
									<div className="manga">
										<Navbar />
										<div className="container">
											<div className="manga-title">
												{manga.name} - {manga.author}
											</div>
											<div className="manga-container">
												<p className="synopsis">
													<img src={manga.image} alt={manga.name} />
													<span>{manga.synopsis}</span>
												</p>
											</div>
											<div className="chapters">
												<div className="btns">
													{last ? (
														<>
															{last !== 1 ? (
																<>
																	<Link className="btn" to={`/manga/${id}/1/1`}>
																		<span>1</span>
																	</Link>
																	<Link className="btn" to={`/manga/${id}/${last}/1`}>
																		<span>{last}</span>
																	</Link>
																</>
															) : (
																<>
																	<Link className="btn" to={`/manga/${id}/1/1`}>
																		<span>1</span>
																	</Link>
																</>
															)}
														</>
													) : null}
												</div>
												<select
													name="pages"
													className="chap-selector"
													id="page-select"
													onChange={handleChange}
													value={selectValue}
												>
													<option value="">CHOISIR UN CHAPITRE</option>
													{scans.map((scan) => {
														return scan;
													})}
												</select>
											</div>
										</div>
										<Footer />
									</div>
								</>
							)}
						</>
					) : (
						<>
							<Navbar />
							<div className="loading-container">
								<div className="loading">
									<div></div>
									<div></div>
									<div></div>
								</div>
							</div>
							<Footer />
						</>
					)}
				</>
			)}
		</>
	);
};

export default Manga;
