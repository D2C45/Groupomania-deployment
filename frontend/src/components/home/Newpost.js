import React, { useContext, useRef, useState } from 'react'
import axios from 'axios'
import { UserContext } from '../../utils/context'

const Newpost = () => {
   const { userData, changes, setChanges } = useContext(UserContext)

   const [message, setMessage] = useState('')
   const [picture, setPicture] = useState('')
   const [file, setFile] = useState('')
   // ref pour pouvoir vider le fichier uploader
   const ref = useRef()

   const sendPost = () => {
      if (message || picture) {
         const data = new FormData()
         const content = {
            postUserId: JSON.parse(localStorage.getItem('auth')).userId,
            message: message,
         }
         const contentString = JSON.stringify(content)
         data.append('content', contentString)
         if (file) {
            data.append('image', file)
         }

         axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}api/posts`,
            withCredentials: true,
            headers: {
               Authorization: `Bearer ${
                  JSON.parse(localStorage.getItem('auth')).token
               }`,
            },
            data,
         })
            .then((response) => {
               console.log(response)
               setChanges(!changes)
            })
            .catch(function (error) {
               console.log(error)
            })

         cancelPost()
      } else {
         console.log('Pas de post')
      }
   }

   const uploadPicture = (e) => {
      setPicture(URL.createObjectURL(e.target.files[0]))
      setFile(e.target.files[0])
   }

   const cancelPost = () => {
      setMessage('')
      setPicture('')
      setFile('')
      ref.current.value = ''
   }

   return (
      <div className="card-container newpost-container">
         <div className="newpost-header">
            <img
               src={
                  userData.imageUrl === ''
                     ? require('../../assets/default-avatar.png')
                     : userData.imageUrl
               }
               alt="avatar de la personne connectée"
               className="avatar"
            />
            <textarea
               name="message"
               id="message"
               className="message"
               placeholder="Ecrivez quelque chose..."
               maxLength={500}
               value={message}
               onChange={(e) => setMessage(e.target.value)}
            />
         </div>

         {message || picture ? (
            <div className="card-container border">
               <div className="card-user pb10">
                  <img
                     src={
                        userData.imageUrl === ''
                           ? require('../../assets/default-avatar.png')
                           : userData.imageUrl
                     }
                     alt="avatar  de la personne connectée"
                     className="avatar"
                  />
                  <div className="card-userinfo">
                     <p className="author">auteur du post</p>
                     <p className="date">date du post</p>
                  </div>
               </div>

               <div className="card-body">
                  <p className="pb10">{message}</p>
                  <div className="pb10">
                     <img src={picture} alt="" className="post-picture" />
                  </div>
               </div>
            </div>
         ) : null}

         <div className="newpost-footer">
            <div className="btn-picture">
               <label
                  htmlFor="image"
                  id="image-label"
                  className="upload-img-label"
                  aria-label="click pour ajouter une image"
               >
                  <i className="far fa-file-image" aria-hidden="true"></i>
               </label>
               <input
                  type="file"
                  id="image"
                  name="image"
                  className="upload-img"
                  accept=".jpg, .jpeg, .png"
                  ref={ref}
                  onChange={(e) => uploadPicture(e)}
                  onFocus={(e) =>
                     document
                        .getElementById('image-label')
                        .classList.add('rounded')
                  }
                  onBlur={(e) =>
                     document
                        .getElementById('image-label')
                        .classList.remove('rounded')
                  }
               />
            </div>
            <div>
               {message || picture ? (
                  <button className="btn-send" onClick={cancelPost}>
                     Annuler
                  </button>
               ) : null}
               <button className="btn-send" onClick={sendPost}>
                  Envoyer
               </button>
            </div>
         </div>
      </div>
   )
}

export default Newpost
