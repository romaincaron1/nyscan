import { React, useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Registration from "./pages/registration";
import Connexion from "./pages/connexion";
import Scan from "./pages/scan";
import Mangas from "./pages/mangas";
import Manga from "./pages/manga";
import NotFound from "./pages/notfound";
import Discover from "./pages/discover";
import MyList from "./pages/mylist";
import Profil from "./pages/profil";
import About from "./pages/about";
import ProtectedRoute from "./components/protectedRoute";
import { hasAuthenticated, hasIsAdmin } from "./services/AuthApi";
import Auth from "./contexts/Auth";
import "./styles/main.scss";
import Dashboard from "./pages/dashboard";
import AdminRoute from "./components/adminRoute";
import Admin from "./contexts/Admin";
import CreateManga from "./pages/createmanga";
import AddScan from "./pages/addscan";
import EditManga from "./pages/editmanga";
import DeleteManga from "./pages/deletemanga";
import Selection from "./pages/selection";

const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(hasAuthenticated());
	const [isAdmin, setIsAdmin] = useState(hasIsAdmin());

	return (
		<Auth.Provider value={{ isAuthenticated, setIsAuthenticated }}>
			<Admin.Provider value={{ isAdmin, setIsAdmin }}>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/discover" element={<Discover />} />
						<Route path="/profil" element={<ProtectedRoute />}>
							<Route path="/profil" element={<Profil />} />
						</Route>
						<Route path="/mylist" element={<ProtectedRoute />}>
							<Route path="/mylist" element={<MyList />} />
						</Route>
						<Route path="/registration" element={<Registration />} />
						<Route path="/connexion" element={<Connexion />} />
						<Route path="/mangas" element={<Mangas />} />
						<Route path="/manga/:id" element={<Manga />} />
						<Route path="/manga/:id/:scan/:page" element={<Scan />} />
						<Route path="/about" element={<About />} />
						<Route path="/dashboard" element={<AdminRoute />}>
							<Route path="/dashboard" element={<Dashboard />} />
						</Route>
						<Route path="/manga/create" element={<AdminRoute />}>
							<Route path="/manga/create" element={<CreateManga />} />
						</Route>
						<Route path="/manga/add" element={<AdminRoute />}>
							<Route path="/manga/add" element={<AddScan />} />
						</Route>
						<Route path="/manga/edit" element={<AdminRoute />}>
							<Route path="/manga/edit" element={<EditManga />} />
						</Route>
						<Route path="/manga/delete" element={<AdminRoute />}>
							<Route path="/manga/delete" element={<DeleteManga />} />
						</Route>
						<Route path="/selection" element={<AdminRoute />}>
							<Route path="/selection" element={<Selection />} />
						</Route>
						<Route path="*" element={<NotFound />} />
					</Routes>
				</BrowserRouter>
			</Admin.Provider>
		</Auth.Provider>
	);
};

export default App;
