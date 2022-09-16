import React, { useContext, useState } from 'react'
import axios from 'axios'
import FormInput from './FormInput'
import Button from './Button'
import { emailValidation, passwordValidation } from '../../utils/functions'
import { UserContext } from '../../utils/context'
import { useNavigate } from 'react-router-dom'

const Signin = () => {
   const { login } = useContext(UserContext)
   const navigate = useNavigate()

   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')

   const [emailErrorMsg, setEmailErrorMsg] = useState('')
   const [passwordErrorMsg, setPasswordErrorMsg] = useState('')

   const [emailValid, setEmailValid] = useState(false)
   const [passwordValid, setPasswordValid] = useState(false)

   const signin = (e) => {
      e.preventDefault()

      if (email.length === 0) {
         setEmailErrorMsg('Ce champ est requis')
      } else if (password.length === 0) {
         setPasswordErrorMsg('Ce champ est requis')
      } else if (emailValid && passwordValid) {
         axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}api/user/login`,
            withCredentials: true,
            data: {
               email,
               password,
            },
         })
            .then((response) => {
               login(response.data)
               navigate('/')
            })
            .catch(function (error) {
               console.log(error)
               setPasswordErrorMsg(error.response.data.error)
            })
      }
   }

   return (
      <form method="post" onSubmit={(e) => signin(e)}>
         <FormInput
            inputName={'email'}
            inputHolder={'Email'}
            Value={email}
            errorMsg={emailErrorMsg}
            onChange={(e) =>
               emailValidation(e, setEmail, setEmailErrorMsg, setEmailValid)
            }
         />

         <FormInput
            inputName={'password'}
            inputHolder={'Mot de passe'}
            Value={password}
            errorMsg={passwordErrorMsg}
            onChange={(e) =>
               passwordValidation(
                  e,
                  setPassword,
                  setPasswordErrorMsg,
                  setPasswordValid
               )
            }
         />

         <Button btnName={'Se connecter'} />
      </form>
   )
}

export default Signin
