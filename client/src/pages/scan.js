import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import NotFound from "../components/not_found";
import Auth from "../contexts/Auth";
import { getMe } from "../services/ApiCalls";
import { instance } from "../services/instance";
import { updateItem } from "../services/storage";

const Scan = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useContext(Auth);
	const { id, scan, page } = useParams();
	const [image, setImage] = useState();
	const [error, setError] = useState();
	const [pages, setPages] = useState();
	const [name, setName] = useState();
	const [isLast, setIsLast] = useState();
	const previous = parseInt(page) - 1;
	const next = parseInt(page) + 1;

	useEffect(() => {
		if (isAuthenticated) {
			getMe().then((response) => {
				if (response.ended.includes(id)) {
					let newEnded = response.ended;
					newEnded = newEnded.filter(function (f) {
						return f !== id;
					});
					instance.get(`/stats/${id}`).then((response) => {
						instance
							.patch("/stats/", {
								manga: id,
								watched: response.data.watched - 1,
							})
							.then((_) => {
								instance.patch("/users/", { ended: newEnded }).then((res) => {
									updateItem("x-auth-token", res.data);
								});
							});
					});
				}

				let isInMyStopped = false;
				response.stopped.map((manga) => {
					if (manga[0] === id) {
						isInMyStopped = true;
					}
				});
				if (!isInMyStopped) {
					instance.get(`/stats/${id}`).then((res) => {
						instance.patch("/stats/", { manga: id, watching: res.data.watching + 1 });
					});
				}

				instance.get(`/scans/${id}/${parseInt(scan)}`).then((res) => {
					const pages = res.data.pages.length;
					if (page > 0 && page <= pages && res.data.number === parseInt(scan)) {
						if (response.stopped.length !== 0) {
							let count = 0;
							response.stopped.map((stoppedManga) => {
								if (stoppedManga[0] === id) {
									count++;
								}
							});
							if (count === 1) {
								let array = [];
								response.stopped.map((stoppedManga) => {
									if (stoppedManga[0] !== id) {
										array = [...array, stoppedManga];
									}
								});
								array = [...array, [id, scan, page]];
								array = array.reverse();
								instance.patch("/users/", { stopped: array }).then((res) => {
									updateItem("x-auth-token", res.data);
								});
							} else {
								let newStopped = [...response.stopped, [id, scan, page]];
								instance.patch("/users/", { stopped: newStopped }).then((res) => {
									updateItem("x-auth-token", res.data);
								});
							}
						} else {
							let newStopped = [...response.stopped, [id, scan, page]];
							instance.patch("/users/", { stopped: newStopped }).then((res) => {
								updateItem("x-auth-token", res.data);
							});
						}
					}

					if (isLast && parseInt(page) === pages) {
						let index = 0;
						let newStopped = [];
						for (let i = 0; i < response.stopped.length; i++) {
							if (response.stopped[i][0] === id) {
								index = i;
								break;
							}
						}

						for (let i = 0; i < response.stopped.length; i++) {
							if (i !== index) {
								newStopped = [...newStopped, response.stopped[i]];
							}
						}
						let newEnded = [...response.ended, id];
						instance.get(`/stats/${id}`).then((response) => {
							instance
								.patch("/stats/", {
									manga: id,
									watching: response.data.watching - 1,
									watched: response.data.watched + 1,
								})
								.then((_) => {
									instance
										.patch("/users/", { stopped: newStopped, ended: newEnded })
										.then((res) => {
											updateItem("x-auth-token", res.data);
										});
								});
						});
					}
				});
			});
		}
	}, [page]);

	useEffect(() => {
		instance.get(`/scans/${id}/${parseInt(scan)}`).then((res) => {
			if (res.data.number !== parseInt(scan)) {
				setError(true);
			} else {
				if (res.data.pages[page - 1]) {
					setImage(res.data.pages[page - 1]);
					setPages(res.data.pages.length);
				} else {
					setError(true);
				}
			}
		});
	}, [page]);

	useEffect(() => {
		instance.get(`/mangas/${id}`).then((res) => {
			setName(res.data.name);
		});
	}, [id]);

	useEffect(() => {
		instance.get(`/mangas/${id}`).then((res) => {
			if (parseInt(scan) === res.data.scans.length) {
				setIsLast(true);
			}
		});
	}, [scan]);

	const handlePreviousButton = () => {
		if (page > 1) {
			setImage();
			navigate(`/manga/${id}/${scan}/${previous}`);
		}
	};

	const handleNextButton = () => {
		if (page < pages) {
			setImage();
			navigate(`/manga/${id}/${scan}/${next}`);
		}
	};

	const handleNextChapter = () => {
		setImage();
		navigate(`/manga/${id}/${parseInt(scan)+1}/${1}`);
	}

	return (
		<div className="scan">
			<Navbar />
			{error ? (
				<>
					<NotFound />
				</>
			) : (
				<>
					{name ? (
						<span className="infos">
							{name} {scan} - Page {page}
						</span>
					) : null}
					{image ? (
						<div className="container">
							<img src={image} alt={page} />
							<div className="btns">
								{page > 1 ? (
									<a href="#" onClick={handlePreviousButton}>
										Page précédente
									</a>
								) : (
									<a href="/">Retour à l'accueil</a>
								)}
								{page < pages ? (
									<a href="#" onClick={handleNextButton}>
										Page suivante
									</a>
								) : isLast ? (
									<a href="/">Retour à l'accueil</a>
								) : (
									<a href="#" onClick={handleNextChapter}>Chapitre suivant</a>
								)}
							</div>
						</div>
					) : (
						<div>Loading...</div>
					)}
				</>
			)}
		</div>
	);
};

export default Scan;
