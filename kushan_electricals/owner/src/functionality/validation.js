export function validatePrice(price) {
    var regex = /^\d+(\.\d{1,2})?$/;
    if (!regex.test(price)) {
        return false;
    }
    return true;
}


export function validateIntegers(number) {
    var regex = /^(0|[1-9]\d*)(\.\d+)?$/;

    if (!regex.test(number)) {
        return false;
    }
    else {
        return true;
    }
}

export function nameValidation(name) {
    var regex = /^[a-zA-Z0-9\s_-]+$/;
    if (!regex.test(name)) {
        return false;
    }
    return true;
}

export function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(emailRegex.test(email)){
        return true;
    }else{
        return false;
    }
}

export function validatePassword(password) {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{7,}$/;
    if(passwordRegex.test(password)){
        return true;
    }else{
        return false;
    }
}

export function convertToPriceFormat(price) {
    return price.toFixed(2);
}