import React, { useContext, useRef, useState } from 'react'
import axios from 'axios'
import { UserContext } from '../../utils/context'

const UpdateProfile = ({
   user,
   setUpdate,
   picture,
   setPicture,
   file,
   setFile,
   cancelModifications,
}) => {
   const { changes, setChanges } = useContext(UserContext)

   const [description, setDescription] = useState(user.description)

   // ref pour pouvoir vider le fichier uploader
   const ref = useRef()

   const changePicture = (e) => {
      setPicture(URL.createObjectURL(e.target.files[0]))
      setFile(e.target.files[0])
   }

   const sendUserModifications = () => {
      const data = new FormData()
      const content = {
         description: description,
         imageUrl: picture,
      }
      const contentString = JSON.stringify(content)
      data.append('user', contentString)
      if (file) {
         data.append('image', file)
      }

      axios({
         method: 'put',
         url: `${process.env.REACT_APP_API_URL}api/user/${user._id}`,
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
               defaultValue={description}
               className="message message-large"
               onChange={(e) => setDescription(e.target.value)}
            />
         </div>
         <div className="newpost-footer">
            <div className="btn-picture">
               <label
                  htmlFor={`image-${user._id}`}
                  id={`image-label-${user._id}`}
                  className="upload-img-label"
                  aria-label="click pour ajouter ou changer la photo de profil"
               >
                  <i className="far fa-file-image" aria-hidden="true"></i>
               </label>
               <input
                  type="file"
                  id={`image-${user._id}`}
                  name="image"
                  className="upload-img"
                  accept=".jpg, .jpeg, .png"
                  ref={ref}
                  onChange={(e) => changePicture(e)}
                  onFocus={(e) =>
                     document
                        .getElementById(`image-label-${user._id}`)
                        .classList.add('rounded')
                  }
                  onBlur={(e) =>
                     document
                        .getElementById(`image-label-${user._id}`)
                        .classList.remove('rounded')
                  }
               />
            </div>
            <div>
               <button className="btn-send" onClick={cancelModifications}>
                  Annuler
               </button>
               <button className="btn-send" onClick={sendUserModifications}>
                  Envoyer
               </button>
            </div>
         </div>
      </div>
   )
}

export default UpdateProfile
