import React, { useContext } from 'react'
import logo from '../assets/logo.png'
import { UserContext } from '../utils/context'
import { Link } from 'react-router-dom'

const Header = () => {
   const { logout } = useContext(UserContext)

   return (
      <header>
         <nav>
            <div className="logo-container">
               <Link to="/">
                  <img
                     src={logo}
                     alt="logo de Groupomania qui permet de retourner à la page d'acceuil"
                     className="logo"
                     title="Page d'acceuil"
                  />
               </Link>
            </div>
            <ul>
               <li>
                  <Link to="/account" aria-label="Lien vers votre profil">
                     <i
                        className="fas fa-user"
                        aria-hidden="true"
                        title="Profil"
                     ></i>
                  </Link>
               </li>
               <li>
                  <Link
                     to="/users"
                     aria-label="Lien vers la liste des comptes utilisateurs"
                  >
                     <i
                        className="fas fa-users"
                        aria-hidden="true"
                        title="Utilisateurs"
                     ></i>
                  </Link>
               </li>
               <li>
                  <Link to="/login" aria-label="Bouton pour se déconnecter">
                     <i
                        className="fas fa-sign-out-alt"
                        aria-hidden="true"
                        title="Déconnection"
                        onClick={logout}
                     ></i>
                  </Link>
               </li>
            </ul>
         </nav>
      </header>
   )
}

export default Header
