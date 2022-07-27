import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Auth from "../contexts/Auth";
import { getUserName, removeItem } from "../services/storage";
import logo from "../images/logo.png";
import { getMe } from "../services/ApiCalls";

const Navbar = () => {
	const { isAuthenticated, setIsAuthenticated } = useContext(Auth);
	const [scrollMenu, setScrollMenu] = useState(false);
	const [user, setUser] = useState();
	const navigate = useNavigate();
	const userName = getUserName();

	const handleClick = () => setScrollMenu(!scrollMenu);

	const handleLogout = () => {
		removeItem("x-auth-token");
		removeItem("username");
		removeItem("list");
		setIsAuthenticated(false);
		window.location.reload(false);
		navigate("/");
	};

	useEffect(() => {
		if (isAuthenticated) {
			getMe().then((response) => {
				setUser(response);
			});
		}
	}, []);

	return (
		<div className={scrollMenu ? "navbar scroll" : "navbar"}>
			<div className="scrolling-btn">
				<button onClick={handleClick}>
					<i className={scrollMenu ? "bx bx-x" : "bx bx-menu"}></i>
				</button>
			</div>
			<div
				className={scrollMenu ? "navbar-container display" : "navbar-container"}
			>
				<div className="left"></div>
				<div className="center">
					<ul>
						<li>
							<Link to="/discover">
								<span>DECOUVRIR</span>
							</Link>
						</li>
						<li>
							<Link to="/mangas">
								<span>MANGAS</span>
							</Link>
						</li>
						<li className="logo">
							<Link to="/">
								<img src={logo} alt="nyscan-logo" />
							</Link>
						</li>
						<li>
							<Link to="/mylist">
								<span>MA LISTE</span>
							</Link>
						</li>
						<li>
							<Link to="/profil">
								<span>MON PROFIL</span>
							</Link>
						</li>
					</ul>
				</div>
				<div className="right">
					{isAuthenticated ? (
						<ul>
							<li>
								{user ? (
									<>
										{user.isAdmin ? (
											<>
												<Link to={`/dashboard`}>
													DASHBOARD
												</Link>
											</>
										) : null}
									</>
								) : null}
							</li>
							<li>
								<span className="name">{userName.toUpperCase()}</span>
							</li>
							<li>
								<a className="sign-btn" onClick={handleLogout}>
									DECONNEXION
								</a>
							</li>
						</ul>
					) : (
						<ul>
							<li>
								<Link to="/connexion">
									<span>CONNEXION</span>
								</Link>
							</li>
							<li>
								<Link to="/registration" className="sign-btn">
									<span>S'INSCRIRE</span>
								</Link>
							</li>
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
