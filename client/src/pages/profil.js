import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Auth from "../contexts/Auth";
import { getMe } from "../services/ApiCalls";
import { instance } from "../services/instance";
import { updateItem } from "../services/storage";

const Profil = () => {
	const { isAuthenticated } = useContext(Auth);
	const [user, setUser] = useState();
	const navigate = useNavigate();

	// Values
	const [newName, setNewName] = useState("");
	const [newMail, setNewMail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// Submitted
	const [isNameSubmitted, setIsNameSubmitted] = useState(false);
	const [isMailSubmitted, setIsMailSubmitted] = useState(false);
	const [isPasswordSubmitted, setIsPasswordSubmitted] = useState(false);
	const [ended, setEnded] = useState();

	// Errors
	const [errors, setErrors] = useState([]);

	useEffect(() => {
		if (isAuthenticated) {
			getMe()
				.then((response) => {
					setUser(response);
					let array = [];
					response.ended.map((manga) => {
						instance.get(`/mangas/${manga}`).then((res) => {
							array = [...array, res.data];
							setEnded(array);
						});
					});
				})
				.catch(() => {
					navigate("/");
				});
		} else {
			navigate("/");
		}
	}, [isNameSubmitted, isMailSubmitted, isPasswordSubmitted]);

	const handleNameChange = (e) => {
		e.preventDefault();
		setNewName(e.target.value);
	};

	const handleMailChange = (e) => {
		e.preventDefault();
		setNewMail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		e.preventDefault();
		setNewPassword(e.target.value);
	};

	const handleConfirmPasswordChange = (e) => {
		e.preventDefault();
		setConfirmPassword(e.target.value);
	};

	const handleNameSubmit = () => {
		if (newName.length >= 3 && newName.length <= 25) {
			instance
				.patch("/users/", { name: newName })
				.then((res) => {
					updateItem("x-auth-token", res.data);
					updateItem("username", newName);
					setIsNameSubmitted(true);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const handleMailSubmit = () => {
		if (newMail.length >= 5 && newMail.length <= 255) {
			var validRegex =
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

			if (newMail.match(validRegex)) {
				instance
					.patch("/users/", { email: newMail })
					.then((res) => {
						updateItem("x-auth-token", res.data);
						setIsMailSubmitted(true);
					})
					.catch((err) => {
						console.log(err.status);
					});
			}
		}
	};

	const handlePasswordSubmit = () => {
		setIsPasswordSubmitted(true);
	};

	const convertedDate = () => {
		let date = user.createdAt;
		let convertedDate = "";
		for (let i = 0; i < 10; i++) {
			convertedDate = convertedDate + date[i];
		}
		convertedDate = convertedDate.split("-");
		return convertedDate[2] + "/" + convertedDate[1] + "/" + convertedDate[0];
	};

	return (
		<div className="profil">
			<Navbar />
			{user ? (
				<>
					<div className="profil-container">
						<div className="infos">
							<ul className="user">
								<li>{user.name}</li>
								<li>Pseudonyme : {user.name}</li>
								<li>Adresse mail : {user.email}</li>
								<li>Inscrit le : {convertedDate()}</li>
							</ul>
							<ul className="update">
								<li>
									{isNameSubmitted ? (
										<span className="submitted-text">
											Votre pseudonyme a été modifié avec succès !
										</span>
									) : (
										<>
											<input
												type="text"
												placeholder="Modifier votre pseudonyme"
												value={newName}
												onChange={handleNameChange}
											/>
											<div className="btn">
												<button className="valid" onClick={handleNameSubmit}>
													Valider
												</button>
											</div>
										</>
									)}
								</li>
								<li>
									{isMailSubmitted ? (
										<span className="submitted-text">
											Votre mail a été modifié avec succès !
										</span>
									) : (
										<>
											<input
												type=""
												placeholder="Modifier votre e-mail"
												value={newMail}
												onChange={handleMailChange}
											/>
											<div className="btn">
												<button className="valid" onClick={handleMailSubmit}>
													Valider
												</button>
											</div>
										</>
									)}
								</li>
								<li>
									{isPasswordSubmitted ? (
										<span className="submitted-text">
											Votre mot de passe a été modifié avec succès !
										</span>
									) : (
										<>
											<input
												type="password"
												placeholder="Modifier votre mot de passe"
												value={newPassword}
												onChange={handlePasswordChange}
											/>
											<input
												type="password"
												placeholder="Confirmer votre mot de passe"
												value={confirmPassword}
												onChange={handleConfirmPasswordChange}
											/>
											<div className="btn">
												<button className="valid" onClick={handlePasswordSubmit}>
													Valider
												</button>
											</div>
										</>
									)}
								</li>
								{user.isAdmin ? (
									<>
										<Link to={`/dashboard`} className="dashboard-btn">
											Dashboard
										</Link>
									</>
								) : null}
							</ul>
							<div className="errors">
								{errors.map((error) => {
									return <span>{error}</span>;
								})}
							</div>
						</div>
						<div className="statistics">
							<ul className="stats">
								<li>
									<span className="number">{user.list.length}</span>
									<span className="text">manga dans ma liste</span>
								</li>
								<li>
									<span className="number">{user.stopped.length}</span>
									<span className="text">manga en cours</span>
								</li>
								<li>
									<span className="number">{user.ended.length}</span>
									<span className="text">manga terminé(s)</span>
								</li>
							</ul>
						</div>
					</div>
					<div className="myEnded">
						<div className="title">
							<span>Mangas Terminés</span>
						</div>
						<div className="container">
							{ended ? (
								<>
									{ended.map((manga) => (
										<div key={manga._id} className="manga_bloc">
											<Link to={`/manga/${manga._id}`}>
												<img className="image" src={manga.image} alt={manga.name} />
												<div className="fadedbox">
													<div className="text">
														<span className="name">{manga.name}</span>
														{manga.scans.length > 1 ? (
															<span>{manga.scans.length} Tomes</span>
														) : (
															<span>1 Tome</span>
														)}
													</div>
												</div>
											</Link>
										</div>
									))}
								</>
							) : (
								<></>
							)}
						</div>
					</div>
				</>
			) : null}
		</div>
	);
};

export default Profil;
