export function validateName(name) {
    // Check if the name is not empty
    if (!name) {
      return { isValid: false, errorMessage: "Name is required" };
    }
  
    // Check if the name contains only letters and spaces
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return { isValid: false, errorMessage: "Name can only contain letters and spaces" };
    }
  
    // Check if the name is at least 2 characters long
    if (name.length < 2) {
      return { isValid: false, errorMessage: "Name must be at least 2 characters long" };
    }
  
    // Check if the name is not too long
    if (name.length > 50) {
      return { isValid: false, errorMessage: "Name must be less than 50 characters long" };
    }
  
    // If all checks pass, return isValid true (indicating no errors)
    return { isValid: true, errorMessage: "" };
  }
  
 export function validateEmail(email) {
    // Check if the email is not empty
    if (!email) {
      return { isValid: false, errorMessage: "Email is required" };
    }
  
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Check if the email matches the regular expression
    if (!emailRegex.test(email)) {
      return { isValid: false, errorMessage: "Invalid email format" };
    }
  
    // If all checks pass, return isValid true (indicating no errors)
    return { isValid: true, errorMessage: "" };
  }
  
 export function validatePhoneNumber(phoneNumber) {
    // Check if the phone number is not empty
    if (!phoneNumber) {
      return { isValid: false, errorMessage: "Phone number is required" };
    }
  
    // Regular expression to validate phone numbers
    const phoneRegex = /^(\+94)?(0)?\d{9}$/;
  
    // Check if the phone number matches the regular expression
    if (!phoneRegex.test(phoneNumber)) {
      return { isValid: false, errorMessage: "Invalid phone number format" };
    }
  
    // If all checks pass, return isValid true (indicating no errors)
    return { isValid: true, errorMessage: "" };
  }

 export function validateAddress(address) {
    // Check if the address is not empty
    if (!address) {
      return { isValid: false, errorMessage: "Address is required" };
    }
  
    // If all checks pass, return isValid true (indicating no errors)
    return { isValid: true, errorMessage: "" };
  }

 export function validatePassword(password) {
    // Check if the password is not empty
    if (!password) {
      return { isValid: false, errorMessage: "Password is required" };
    }
  
    // Check if the password is at least 6 characters long
    if (password.length < 6) {
      return { isValid: false, errorMessage: "Password must be at least 6 characters long" };
    }
  
    // If all checks pass, return isValid true (indicating no errors)
    return { isValid: true, errorMessage: "" };
  }
  
 export const validateExpiryDate = (expiry) => {
    // Check if the expiry date is in the MM/YY format
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry)) {
      return {status: false, message: 'Invalid expiry date. Please enter in MM/YY format.'};
    }
  
    // Check if the expiry date is in the future
    const expiryDate = new Date(`20${expiry.slice(3)}`, expiry.slice(0, 2) - 1);
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1); // set to next month
    currentDate.setDate(0); // set to the last day of the next month
    if (expiryDate < currentDate) {
      return {status:false,message:'Invalid expiry date. The date must be in the future.'};
    }
  
    // If there are no errors, return an empty string
    return {status:true,message:''};
  };

 export const validateCVC = (cvc, cardType) => {
    // Regular expressions for different card types
    const cvcRegex = {
      visa: /^[0-9]{3}$/,
      mastercard: /^[0-9]{3}$/,
      amex: /^[0-9]{4}$/
    };
  
    // Check if the CVC matches the regex for the given card type
    if (cvcRegex[cardType]) {
      return cvcRegex[cardType].test(cvc);
    } else {
      return false; // Invalid card type
    }
  };
  
  export const validateCardNumber = (number) => {
    // Regular expression to validate card numbers
    const cardNumberRegex = /^(\d{4} ?){3}\d{1,4}$/;
  
    // Remove spaces from the card number
    const numberWithoutSpaces = number.replace(/\s/g, '');
  
    // Check if the card number matches the regular expression
    if (!cardNumberRegex.test(numberWithoutSpaces)) {
      return {status: false, message: 'Invalid card number. Please enter a valid 13-16 digit card number.'};
    }
  
    // If there are no errors, return an empty string
    return {status: true, message: ''};
  };

export const validateCardHolderName = (name) => {
  // Check if the name is not empty
  if (!name) {
    return {status:false,message:'Name is required'};
  }

  // Check if the name contains only letters, spaces, and .
  if (!/^[a-zA-Z\s.]+$/.test(name)) {
    return {status:false,message:'Name can only contain letters, spaces, and .'};
  }

  // If there are no errors, return an empty string
  return {status:true,message:''};
}