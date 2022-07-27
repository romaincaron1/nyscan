import React, { useContext } from "react";
import Navbar from "../components/navbar";
import Auth from "../contexts/Auth";
import ContentRow from "../components/content_row";
import Poster from "../components/poster";
import Footer from "../components/footer";
import { useEffect } from "react";
import { instance } from "../services/instance";
import { useState } from "react";
import { getMe } from "../services/ApiCalls";

const Home = () => {
	const { isAuthenticated } = useContext(Auth);
	const [mostLiked, setMostLiked] = useState();
	const [selection, setSelection] = useState();
	const [myList, setMyList] = useState();
	const [myStopped, setMyStopped] = useState();
	const [stopped, setStopped] = useState();
	const [listReady, setListReady] = useState(false);
	const [stoppedReady, setStoppedReady] = useState(false);
	const [selectionReady, setSelectionReady] = useState(false);
	const [mostLikedReady, setMostLikedReady] = useState(false);
	const [response, setResponse] = useState(false);

	useEffect(() => {
		setMyList();
		setMyStopped();
		setStopped();
		if (isAuthenticated) {
			getMe()
				.then((res) => {
					// Get my list if not empty
					if (res.list.lenght !== 0) {
						let array = [];
						res.list.map((manga) => {
							instance.get(`/mangas/${manga}`).then((response) => {
								array = [...array, response.data];
								setMyList(array);
								setListReady(true);
							});
						});
					} else {
						setListReady(true);
					}

					// Get my stopped if not empty
					if (res.stopped.lenght !== 0) {
						setStopped(res.stopped);
						let ids = [];
						res.stopped.map((manga) => {
							ids.push(manga[0]);
						});
						let array = [];
						res.stopped.map((manga) => {
							instance.get(`/mangas/${manga[0]}`).then((response) => {
								array = [...array, response.data];
								array = array.sort((a, b) => {
									return ids.indexOf(a._id) - ids.indexOf(b._id);
								});
								setMyStopped(array);
								setStoppedReady(true);
							});
						});
					}
				})
				.catch((err) => console.log(err));
		} else {
			setStoppedReady(true);
			setListReady(true);
		}
	}, []);

	useEffect(() => {
		let array = [];
		instance
			.get("/selection/")
			.then((res) => {
				if (res.data.mangas) {
					res.data.mangas.map((manga) => {
						instance.get(`/mangas/${manga}`).then((response) => {
							array = [...array, response.data];
							setSelection(array);
							setSelectionReady(true);
						});
					});
				} else {
					setSelectionReady(true);
				}
			})
			.catch((err) => console.log(err));
	}, []);

	useEffect(() => {
		instance
			.get("/stats/")
			.then((res) => {
				if (res.data.length !== 0) {
					res.data.sort((a, b) => {
						if (a.likes > b.likes) {
							return -1;
						} else {
							return 1;
						}
					});
					res.data = res.data.slice(0, 5);
					let ids = [];
					res.data.map((stat) => {
						ids.push(stat.manga);
					});
					let mostLiked = [];
					res.data.map((stat) => {
						instance.get(`/mangas/${stat.manga}`).then((response) => {
							mostLiked = [...mostLiked, response.data];
							mostLiked = mostLiked.sort((a, b) => {
								return ids.indexOf(a._id) - ids.indexOf(b._id);
							});
							setMostLiked(mostLiked);
							setMostLikedReady(true);
						});
					});
				} else {
					setMostLikedReady(true);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	useEffect(() => {
		if (stoppedReady && listReady && mostLikedReady && selectionReady) {
			setResponse(true);
		}
	}, [stoppedReady, listReady, mostLikedReady, selectionReady])

	return (
		<div className="home">
			<Navbar />
			{response ? (
				<>
					{myStopped ? (
						<>
							<ContentRow title="REPRENDRE" elements={myStopped} stopped={stopped} />
						</>
					) : null}
					{isAuthenticated ? null : <Poster />}
					{selection ? (
						<ContentRow title="NOTRE SELECTION" elements={selection} />
					) : null}
					{mostLiked ? (
						<>
							{myList ? (
								<ContentRow title="LES PLUS AIMÉS" elements={mostLiked} />
							) : (
								<ContentRow title="LES PLUS AIMÉS" elements={mostLiked} last />
							)}
						</>
					) : null}
					{myList ? (
						<>
							<ContentRow title="MA LISTE" elements={myList} last />
						</>
					) : null}
				</>
			) : (
				<div className="loading-container">
					<div className="loading">
						<div></div>
						<div></div>
						<div></div>
					</div>
				</div>
			)}
			<Footer />
		</div>
	);
};

export default Home;
