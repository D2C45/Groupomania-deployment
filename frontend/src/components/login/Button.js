import React from 'react'

const Button = ({ addClass, btnName, onClick }) => {
   return (
      <button className={`btn ${addClass}`} type="submit" onClick={onClick}>
         {btnName}
      </button>
   )
}

export default Button
