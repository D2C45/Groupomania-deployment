import React, { useContext, useRef, useState } from 'react'
import axios from 'axios'
import { UserContext } from '../../utils/context'

const UpdatePost = ({ post, setUpdate }) => {
   const { changes, setChanges } = useContext(UserContext)

   const [message, setMessage] = useState(post.message)
   const [picture, setPicture] = useState(post.imageUrl)
   const [file, setFile] = useState('')

   // ref pour pouvoir vider le fichier uploader
   const ref = useRef()

   const changePicture = (e) => {
      setPicture(URL.createObjectURL(e.target.files[0]))
      setFile(e.target.files[0])
   }

   const deletePicture = () => {
      setPicture('')
      setFile('')
      ref.current.value = ''
   }

   const sendPostModifications = () => {
      const data = new FormData()
      const content = {
         message: message,
         imageUrl: picture,
      }
      const contentString = JSON.stringify(content)
      data.append('content', contentString)
      if (file) {
         data.append('image', file)
      }

      axios({
         method: 'put',
         url: `${process.env.REACT_APP_API_URL}api/posts/${post._id}`,
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
            setUpdate(false)
         })
         .catch(function (error) {
            console.log(error)
         })
   }

   return (
      <div className="update-form">
         <div className="card-body">
            <textarea
               defaultValue={message}
               className="message message-large"
               onChange={(e) => setMessage(e.target.value)}
            />
            <div className="pb10">
               {picture !== '' ? (
                  <div className="delete-picture-container">
                     <div>
                        <img
                           src={picture}
                           alt="illustration"
                           className="post-picture"
                        />
                     </div>
                     <div>
                        <button
                           onClick={deletePicture}
                           aria-label="Bouton pour supprimer la photo"
                        >
                           <i
                              className="far fa-times-circle"
                              aria-hidden="true"
                              title="Supprimer"
                           ></i>
                        </button>
                     </div>
                  </div>
               ) : null}
            </div>
         </div>
         <div className="newpost-footer">
            <div className="btn-picture">
               <label
                  htmlFor={`image-${post._id}`}
                  id={`image-label-${post._id}`}
                  className="upload-img-label"
                  aria-label="click pour ajouter ou changer l'image"
               >
                  <i className="far fa-file-image" aria-hidden="true"></i>
               </label>
               <input
                  type="file"
                  id={`image-${post._id}`}
                  name="image"
                  className="upload-img"
                  accept=".jpg, .jpeg, .png"
                  ref={ref}
                  onChange={(e) => changePicture(e)}
                  onFocus={(e) =>
                     document
                        .getElementById(`image-label-${post._id}`)
                        .classList.add('rounded')
                  }
                  onBlur={(e) =>
                     document
                        .getElementById(`image-label-${post._id}`)
                        .classList.remove('rounded')
                  }
               />
            </div>
            <div>
               <button className="btn-send" onClick={() => setUpdate(false)}>
                  Annuler
               </button>
               <button className="btn-send" onClick={sendPostModifications}>
                  Envoyer
               </button>
            </div>
         </div>
      </div>
   )
}

export default UpdatePost
