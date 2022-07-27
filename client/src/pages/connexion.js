import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { instance } from "../services/instance";
import Navbar from "../components/navbar";
import Auth from "../contexts/Auth";
import { addItem, getItem, removeItem } from "../services/storage";
import Footer from "../components/footer";
import { hasIsAdmin } from "../services/AuthApi";
import Admin from "../contexts/Admin";

const Connexion = () => {
	const location = useLocation();
	const { setIsAdmin } = useContext(Admin);
	const { isAuthenticated, setIsAuthenticated } = useContext(Auth);
	const navigate = useNavigate();

	// Values
	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");

	// Error
	const [error, setError] = useState();

	// Already conntected
	useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	});

	const handleMailChange = (e) => {
		setMail(e.target.value);
		setError();
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
		setError();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (mail && password) {
			if (password.length > 24 || password.length < 6) {
				setError("Le mot de passe doit contenir entre 6 et 24 caractères");
			} else {
				instance
					.post("/login", {
						email: mail,
						password: password,
					})
					.then((res) => {
						instance.defaults.headers.common["x-auth-token"] = `Bearer ${res.data}`;
						instance
							.get("/users/me")
							.then((response) => {
								if (getItem("x-auth-token")) {
									removeItem("x-auth-token");
								}
								if (getItem("username")) {
									removeItem("username");
								}
								addItem("x-auth-token", res.data);
								addItem("username", response.data.user.name);
								if (hasIsAdmin()) {
									setIsAdmin(true);
								}
								setIsAuthenticated(true);
								navigate("/");
							})
							.catch((err) => {
								setError(err.response.data);
							});
					})
					.catch((err) => {
						if (err.response.status === 404) {
							// Email not found
							setError("Adresse e-mail introuvable");
						} else if (err.response.status === 406) {
							// Password does not math with email
							setError("Le mot de passe ne correspond pas à l'adresse e-mail fournie");
						} else {
							// Unknown error
							setError(err.response.data);
						}
					});
			}
		} else {
			setError("Veuillez entrer une adresse e-mail et un mot de passe");
		}
	};

	return (
		<div className="connexion">
			<Navbar />
			{location.state ? (
				<div className="registered-alert">
					Vous êtes désormais inscrit ! Connectez-vous pour accéder à tout le contenu
					de Nyscan.
				</div>
			) : null}
			<div className="connexion-container">
				<h3 className="connexion-title">CONNEXION</h3>
				<form className="connexion-form" onSubmit={handleSubmit}>
					<ul className="links">
						<li>
							<input
								type="email"
								name="username"
								value={mail}
								placeholder="Votre e-mail"
								onChange={handleMailChange}
							></input>
						</li>
						<li>
							<input
								type="password"
								name="password"
								value={password}
								placeholder="Votre mot de passe"
								onChange={handlePasswordChange}
							></input>
						</li>
						{error ? (
							<li className="error">
								<span>{error}</span>
							</li>
						) : null}
						<li>
							<button className="btn-registration" type="submit">
								CONNEXION
							</button>
							<span className="already-registered">
								Pas encore inscrit ? <a href="/registration">Inscrivez-vous ici</a>
							</span>
						</li>
					</ul>
				</form>
			</div>
			<Footer />
		</div>
	);
};

export default Connexion;
