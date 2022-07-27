import React from "react";
import Navbar from "../components/navbar";
import alphabet from "../data/alphabet.json";
import Footer from "../components/footer";
import { useEffect } from "react";
import { instance } from "../services/instance";
import ContentRow from "../components/content_row";
import { useState } from "react";
import uniqueKey from "unique-key";

const Mangas = () => {
	const letters = alphabet.alphabet;
	const [mangas, setMangas] = useState();

	useEffect(() => {
		instance.get("/mangas/").then((res) => setMangas(res.data));
	}, []);

	return (
		<>
			{mangas ? (
				<div className="scans">
					<Navbar />
					<div className="container">
						{letters.map((letter) => {
							let array = [];
							let objects = [];
							mangas.map((manga) => {
								if (letter.toLowerCase() === manga.name[0].toLowerCase()) {
									array.push(manga.name);
									objects.push(manga);
								}
							});
							if (array.length !== 0) {
								return (
									<div key={uniqueKey()}>
										<ContentRow
											key={uniqueKey()}
											title={letter.toUpperCase()}
											elements={objects}
											last
										/>
										<div key={uniqueKey()} className="space"></div>
									</div>
								);
							}
						})}
					</div>
					<div className="space"></div>
					<Footer />
				</div>
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
	);
};

export default Mangas;
