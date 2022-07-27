import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { instance } from "../services/instance";
import barsSize from "../data/barsSize.json";

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "top",
		},
		title: {
			display: true,
			text: "Top 5 des mangas",
		},
	},
};

export default function Dashboard() {
	const [data, setData] = useState();
	const [error, setError] = useState();
	const [labels, setLabels] = useState();
	const [stats, setStats] = useState();
	const [userStats, setUserStats] = useState();
	const [mangaStats, setMangaStats] = useState();

	useEffect(() => {
		instance
			.get("/stats/")
			.then((res) => {
				let stats = res.data.sort((a, b) => {
					if (a.likes > b.likes) {
						return -1;
					} else {
						return 1;
					}
				});
				stats = stats.slice(0, 5);
				setStats(stats);
				let labels = [];
				stats.map((stat) => {
					instance.get(`/mangas/${stat.manga}`).then((response) => {
						labels = [...labels, response.data.name];
						setLabels(labels);
					});
				});
			})
			.catch((err) => console.log(err));
	}, []);

	useEffect(() => {
		let userstats = [];
		instance.get("/users/").then((res) => {
			userstats.push(res.data.length);
			let countRegisteredLastMonth = 0;
			res.data.map((user) => {
				const date = new Date();
				const now = [date.getFullYear(), date.getMonth() + 1];
				const registered = user.createdAt.substr(0, 7).split("-");
				let convertedRegistered = [];
				registered.forEach((e) => {
					convertedRegistered.push(parseInt(e));
				});
				if (
					convertedRegistered[0] === now[0] &&
					convertedRegistered[1] === now[1]
				) {
					countRegisteredLastMonth++;
				}
			});
			userstats.push(countRegisteredLastMonth);
			setUserStats(userstats);
		});
	}, []);

	useEffect(() => {
		let mangastats = [];
		instance.get("/mangas/").then((res) => {
			mangastats.push(res.data.length);
			instance.get("/scans/").then((response) => {
				mangastats.push(response.data.length);
				setMangaStats(mangastats);
			});
		});
	}, []);

	useEffect(() => {
		if (labels) {
			if (labels.length === 5) {
				const data = {
					labels,
					datasets: [
						{
							label: `"J'aime"`,
							data: stats.map((stat) => stat.likes),
							backgroundColor: "rgba(53, 162, 235, 0.5)",
							borderWidth: 0,
							barPercentage: barsSize.barsSize,
						},
						{
							label: `En visionnage`,
							data: stats.map((stat) => stat.watching),
							backgroundColor: "rgba(124, 46, 200, 0.5)",
							borderWidth: 0,
							barPercentage: barsSize.barsSize,
						},
						{
							label: `Terminé`,
							data: stats.map((stat) => stat.watched),
							backgroundColor: "rgba(80, 250, 70, 0.5)",
							borderWidth: 0,
							barPercentage: barsSize.barsSize,
						},
					],
				};
				setData(data);
			}
		}
	}, [labels]);

	return (
		<div className="dashboard">
			<Navbar />
			<div className="container">
				<div className="title">Dashboard</div>
				<div className="statistics">
					<div className="mostLiked">
						{error ? (
							<div>{error}</div>
						) : (
							<>
								{data ? <Bar options={options} data={data} /> : <div>Loading...</div>}
							</>
						)}
					</div>
					{userStats && mangaStats ? (
						<div className="users-stats">
							<ul className="stats">
								<li>
									<span className="number">{userStats[0]}</span>
									<span className="text">utilisateur(s) inscrit(s)</span>
								</li>
								<li>
									<span className="number">{userStats[1]}</span>
									<span className="text">utilisateur(s) inscrit(s) ce mois-ci</span>
								</li>
								<li>
									<span className="number">{mangaStats[0]}</span>
									<span className="text">manga(s) dans la bibliothèque</span>
								</li>
								<li>
									<span className="number">{mangaStats[1]}</span>
									<span className="text">chapitre(s) de manga au total</span>
								</li>
							</ul>
						</div>
					) : null}
				</div>
				<div className="btns">
					<ul>
						<li>
							<Link className="btn" to={`/manga/create`}>Ajouter un manga</Link>
						</li>
						<li>
							<Link className="btn" to={`/manga/add`}>Ajouter un chapitre</Link>
						</li>
						<li>
							<Link className="btn" to={`/manga/edit`}>Modifier les informations d'un manga</Link>
						</li>
						<li>
							<Link className="btn" to={`/manga/delete`}>Supprimer un manga</Link>
						</li>
						<li>
							<Link className="btn" to={`/selection`}>Modifier la selection</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
