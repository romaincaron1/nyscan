import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentRow from "../components/content_row";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Auth from "../contexts/Auth";
import { getMe } from "../services/ApiCalls";
import { instance } from "../services/instance";
import { updateItem } from "../services/storage";

const MyList = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useContext(Auth);
	const [list, setList] = useState();

	useEffect(() => {
		let array = [];
		if (isAuthenticated) {
			getMe()
				.then((user) => {
					user.list.map((manga) => {
						instance.get(`/mangas/${manga}`).then((response) => {
							array = [...array, response.data];
							setList(array);
						});
					});
				})
				.catch(() => {
					navigate("/connexion");
				});
		} else {
			navigate("/connexion");
		}
	}, []);

	// instance.patch("/users/", { list: newList }).then((res) => {
	// 	instance
	// 		.get(`/stats/${manga._id}`)
	// 		.then((response) => {
	// 			instance.patch("/stats/", { manga: manga._id, likes: response.data.likes+1 }).then((_) => {
	// 				updateItem("x-auth-token", res.data);
	// 			});
	// 		})
	// });

	const handleClearList = () => {
		setList(null);
		list.map((manga) => {
			instance.get(`/stats/${manga._id}`).then((res) => {
				instance.patch('/stats/', { manga: res.data.manga, likes: res.data.likes-1 }).then((_) => {
					instance.patch("/users/", { list: [] }).then((response) => {
						updateItem("x-auth-token", response.data);
					});
				})
			})
		})
	};

	return (
		<div className="mylist">
			<Navbar />
			{list ? (
				<>
					<div className="container">
						<ContentRow title="MA LISTE" elements={list} />
						<button className="btn-clear" onClick={handleClearList}>
							VIDER MA LISTE
						</button>
					</div>
				</>
			) : (
				<div className="container empty">
					<p>Votre liste est vide.</p>
					<p>
						Pour ajouter y ajouter un manga, rendez-vous sur la page de celui-ci.
					</p>
				</div>
			)}
			<Footer />
		</div>
	);
};

export default MyList;
