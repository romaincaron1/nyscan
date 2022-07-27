import React from "react";
import { Link } from "react-router-dom";

const ContentRow = ({ title, elements, stopped, last }) => {
	let i = -1;

	return (
		<div className={last ? "content_row space" : "content_row"}>
			{title ? <div className="title">{title}</div> : null}
			<div className="elements">
				{elements.map((manga) => {
					i++;
					return (
						<div key={manga._id} className="manga_bloc">
							{stopped ? (
								<>
									<Link to={`/manga/${stopped[i][0]}/${stopped[i][1]}/${stopped[i][2]}`}>
										<img className="image" src={manga.image} alt={manga.name} />
										<div className="fadedbox">
											<div className="text">
												<span className="name">{manga.name}</span>
												<span>
													Tome {stopped[i][1]} - Page {stopped[i][2]}
												</span>
											</div>
										</div>
									</Link>
								</>
							) : (
								<>
									<Link to={`/manga/${manga._id}`}>
										<img className="image" src={manga.image} alt={manga.name} />
										<div className="fadedbox">
											<div className="text">
												<span className="name">{manga.name}</span>
												{manga.scans.length > 1 ? (
													<span>{manga.scans.length} Chapitres</span>
												) : null}
												{manga.scans.length === 1 ? (
													<span>{manga.scans.length} Chapitre</span>
												) : null}
												{manga.scans.length < 1 ? (
													<span>À venir</span>
												) : null}
											</div>
										</div>
									</Link>
								</>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ContentRow;
