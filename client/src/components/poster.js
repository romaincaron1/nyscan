import React from "react";
import { Link } from "react-router-dom";

const Poster = () => {
  return (
    <div className="poster">
      <h3 className="poster_text">
        CONNECTEZ VOUS POUR ACCEDER À TOUTES LES FONCTIONNALITÉS DE NYSCAN
        GRATUITEMENT !
      </h3>
      <div className="poster_btns">
        <Link to="/registration" className="link sign-up">
          <span>INSCRIPTION</span>
        </Link>
        <Link to="/connexion" className="link sign-in">
          <span>CONNEXION</span>
        </Link>
      </div>
    </div>
  );
};

export default Poster;
