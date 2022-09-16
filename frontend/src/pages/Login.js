import React from 'react'
import logo from '../assets/logo.png'
import FormBottom from '../components/login/FormBottom'
import { useState } from 'react'
import Signup from '../components/login/SignupForm'
import Signin from '../components/login/SigninForm'

const Login = () => {
   const [isSignup, setIsSignup] = useState(false)

   return (
      <main className="login-container">
         <div className="form-container">
            <div>
               <img src={logo} alt="logo de Groupomania" className="logo" />
            </div>

            {isSignup ? (
               <Signup isSignup={isSignup} setIsSignup={setIsSignup} />
            ) : (
               <Signin />
            )}

            <FormBottom
               alreadyOrNot={'Pas encore'}
               btnDescription={`S'inscrire`}
               isSignup={isSignup}
               setIsSignup={setIsSignup}
            />
         </div>
      </main>
   )
}

export default Login
