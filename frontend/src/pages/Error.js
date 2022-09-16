import React from 'react'
import Header from '../components/Header'

const Error = () => {
   return (
      <>
         <Header />
         <div className="error-container">
            <div className="error">
               <p>Erreur 404</p>
               <p>Cette page n'existe pas</p>
            </div>
         </div>
      </>
   )
}

export default Error
