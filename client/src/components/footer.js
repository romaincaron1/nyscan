import React from "react";
import { Link } from "react-router-dom";
import twitter from "../images/twitter.png";
import discord from "../images/discord.png";
import instagram from "../images/instagram.png";

const Footer = () => {
  return (
    <div className="footer">
      <div className="elements">
        <p className="credit">Nyscan © 2022</p>
        <div className="links">
          <Link to="/about">
            <span>À propos</span>
          </Link>
          <span>|</span>
          <Link to="/cgu">
            <span>CGU</span>
          </Link>
          <span>|</span>
          <Link to="/contact">
            <span>Nous contacter</span>
          </Link>
        </div>
        <div className="icons">
          <a href="https://www.twitter.com/" target="_blank" rel="noreferrer">
            <img src={twitter} alt="twitter-logo" />
          </a>
          <a href="https://www.discord.com/" target="_blank" rel="noreferrer">
            <img src={discord} alt="discord-logo" />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
            <img src={instagram} alt="instagram-logo" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
