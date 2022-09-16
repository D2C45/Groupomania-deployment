import React from 'react'

const FormInput = ({
   inputName,
   inputType = inputName,
   inputHolder,
   Value,
   errorMsg,
   onChange,
}) => {
   return (
      <div className="input-container">
         <label htmlFor={inputName}>{inputHolder}</label>
         <input
            type={inputType}
            name={inputName}
            id={inputName}
            placeholder={inputHolder}
            required
            onChange={onChange}
            value={Value}
         />
         <p>{errorMsg}</p>
      </div>
   )
}

export default FormInput
