import React from 'react'
import { Link } from 'react-router-dom';
import notfound from "../images/notfound.jpg";

export default function NotFound() {
  return (
    <div className='notfound'>
        <img src={notfound} alt="notfound" />
        <div className='container'>
            <p>Cette page n'existe pas !</p>
            <Link className='button' to={`/`}>
                REVENIR A L'ACCUEIL
            </Link>
        </div>
    </div>
  )
}
