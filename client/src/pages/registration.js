import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { instance } from "../services/instance";
import { useNavigate } from "react-router-dom";
import Auth from "../contexts/Auth";
import Footer from "../components/footer";

const Registration = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Auth);
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  // Values
  const [pseudo, setPseudo] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const registerNewError = (errorMsg) => {
    if (!errors.includes(errorMsg)) {
      setErrors((errors) => [...errors, errorMsg]);
    }
  };

  const deleteError = (errorMsg) => {
    if (errors.includes(errorMsg)) {
      const index = errors.indexOf(errorMsg);
      setErrors((errors) => errors.splice(index, ""));
    }
  };

  // Pseudo Verification
  useEffect(() => {
    const regex = new RegExp("^[a-zA-Z0-9_.-]*$");
    if (pseudo.length > 16) {
      registerNewError("Le pseudonyme doit-être inférieur à 16 caractères");
    } else {
      deleteError("Le pseudonyme doit-être inférieur à 16 caractères");
    }
    if (!regex.test(pseudo)) {
      registerNewError("Le pseudonyme doit contenir des caractères valides");
    } else {
      deleteError("Le pseudonyme doit contenir des caractères valides");
    }
  }, [pseudo]);

  // Password Verification
  useEffect(() => {
    if (password.length > 24) {
      registerNewError("Le mot de passe doit-être inférieur à 24 caractères");
    } else {
      deleteError("Le mot de passe doit-être inférieur à 24 caractères");
    }
  }, [password]);

  // Changes
  const handlePseudoChange = (e) => {
    setPseudo(e.target.value);
  };
  const handleMailChange = (e) => {
    setMail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (errors.includes("Cette adresse e-mail est déjà prise.")) {
      deleteError("Cette adresse e-mail est déjà prise.")
    }

    if (pseudo.length < 3) {
      registerNewError("Le pseudonyme doit contenir au moins 3 caractères.")
    }

    if (password.length < 6) {
      registerNewError("Le mot de passe doit contenir au moins 6 caractères.")
    }
    if (mail.length === 0) {
      registerNewError("Veuillez renseigner une adresse e-mail.")
    }

    setSubmitted(true);
  };

  useEffect(() => {
    if(submitted) {
      if (errors.length === 0) {
        instance
          .post("/users", {
            name: pseudo,
            email: mail,
            password: password,
          })
          .then((_) => {
              navigate('/connexion', { state: true })
          })
          .catch(function (error) {
            if (error.response) {
              if (error.response.status === 409) {
                registerNewError("Cette adresse e-mail est déjà prise.")
              } else {
                registerNewError("L'email est invalide.")
              }
            } else {
              console.log(error);
            }
          });
      }
    }
  }, [submitted])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  })

    return (
      <div className="registration">
        <Navbar />
        <div className="registration-container">
          <h3 className="registration-title">INSCRIPTION</h3>
          <form className="registration-form" onSubmit={handleSubmit}>
            <ul className="links">
              <li>
                <input
                  type="text"
                  value={pseudo}
                  onChange={handlePseudoChange}
                  placeholder="Votre pseudonyme"
                ></input>
              </li>
              <li>
                <input
                  type="email"
                  value={mail}
                  onChange={handleMailChange}
                  placeholder="Votre e-mail"
                ></input>
              </li>
              <li>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Votre mot de passe"
                ></input>
              </li>
              <li className="error">
                {errors.map((error) => (
                  <span>{error}</span>
                ))}
              </li>
              <li>
                <button className="btn-registration" type="submit">
                  S'INSCRIRE
                </button>
                <span className="already-registered">
                  Déjà inscrit ? <a href="/connexion">Connectez-vous ici</a>
                </span>
              </li>
            </ul>
          </form>
        </div>
        <Footer />
      </div>
    );
};

export default Registration;
