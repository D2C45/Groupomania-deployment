/**
 * Test la validité de la saisie de l'email, et stocke le message d'erreur et l'email dans le state
 * @param {} event l'évènement écouté
 * @param {string} setEmail le state de l'email
 * @param {string} setEmailErrorMsg le state du message d'erreur
 * @returns
 */
export const emailValidation = (
   event,
   setEmail,
   setEmailErrorMsg,
   setEmailValid
) => {
   const emailInputValue = event.target.value.trim()
   setEmail(emailInputValue)

   setEmailValid(false)

   const emailRegExp = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/
   const emailLength = emailInputValue.length

   let testEmail = emailRegExp.test(emailInputValue)

   let msg

   if (emailLength === 0) {
      msg = 'Ce champ est requis'
   } else if (!testEmail) {
      msg = "Le format de l'email n'est pas valide (ex: nom@domaine.fr)"
   } else {
      msg = ''
      setEmailValid(true)
   }
   setEmailErrorMsg(msg)
}

/**
 * Test la validité de la saisie du mot de passe, et stocke le message d'erreur et le mot de passe dans le state
 * @param {} event l'évènement écouté
 * @param {string} setPassword le state du mot de passe
 * @param {string} setPasswordErrorMsg le state du message d'erreur
 * @returns
 */
export const passwordValidation = (
   event,
   setPassword,
   setPasswordErrorMsg,
   setPasswordValid
) => {
   const passwordInputValue = event.target.value.trim()
   setPassword(passwordInputValue)

   setPasswordValid(false)

   const uppercaseRegExp = /(?=.*?[A-Z])/
   const lowercaseRegExp = /(?=.*?[a-z])/
   const digitsRegExp = /(?=.*?[0-9])/
   const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/
   const minLengthRegExp = /.{8,}/
   const passwordLength = passwordInputValue.length

   let testUppercase = uppercaseRegExp.test(passwordInputValue)
   let testLowercase = lowercaseRegExp.test(passwordInputValue)
   let testDigits = digitsRegExp.test(passwordInputValue)
   let testSpecialChar = specialCharRegExp.test(passwordInputValue)
   let testMinLength = minLengthRegExp.test(passwordInputValue)

   let msg

   if (passwordLength === 0) {
      msg = 'Ce champ est requis'
   } else if (!testUppercase) {
      msg = 'Le mot de passe doit contenir au moins une majuscule'
   } else if (!testLowercase) {
      msg = 'Le mot de passe doit contenir au moins une minuscule'
   } else if (!testDigits) {
      msg = 'Le mot de passe doit contenir au moins un chiffre'
   } else if (!testSpecialChar) {
      msg = 'Le mot de passe doit contenir au moins un caractère spécial'
   } else if (!testMinLength) {
      msg = 'Le mot de passe doit contenir au moins 8 caractères'
   } else {
      msg = ''
      setPasswordValid(true)
   }
   setPasswordErrorMsg(msg)
}

/**
 * Test la validité de la saisie des noms, et stocke le message d'erreur et le nom dans le state
 * @param {} event l'évènement écouté
 * @param {string} setName le state du nom
 * @param {string} setNameErrorMsg le state du message d'erreur
 * @returns
 */
export const nameValidation = (
   event,
   setName,
   setNameErrorMsg,
   setNameValid
) => {
   const nameInputValue = event.target.value.trim()
   setName(nameInputValue)

   setNameValid(false)

   const nameRegExp = /^[a-zA-ZÀ-ÖÙ-öù-ÿ]+([-'\s]{1}[a-zA-ZÀ-ÖÙ-öù-ÿ]+)?$/
   const minNameLengthRegExp = /.{3,}/
   const nameLength = nameInputValue.length

   let testName = nameRegExp.test(nameInputValue)
   let testMinNameLength = minNameLengthRegExp.test(nameInputValue)

   let msg

   if (nameLength === 0) {
      msg = 'Ce champ est requis'
   } else if (!testMinNameLength) {
      msg = 'Ce champ doit contenir au moins 3 caractères'
   } else if (!testName) {
      msg = 'Ce champ ne peut comporter que des caractères alphabétiques'
   } else {
      msg = ''
      setNameValid(true)
   }
   setNameErrorMsg(msg)
}

/**
 * Converti le format de la date
 * @param {date} num la date récupéré dans la base de données
 * @returns la date au format d'affichage requis
 */
export const dateFormat = (date) => {
   let options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
   }
   return new Date(date).toLocaleDateString('fr-FR', options)
}
