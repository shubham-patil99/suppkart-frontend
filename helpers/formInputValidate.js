import { focusOnFeild } from "./frontend";

export const validate = (formData ,setErrors) => {
    const newError = {};
    let positionFocus = "";
    for (let obj in formData) {
        if (formData?.[obj] == "") {
            newError[obj] = "Please fill all Required fields ";
            positionFocus = positionFocus || obj;
        }
    }
    setErrors(newError);
    if (positionFocus) {
        focusOnFeild(positionFocus);
        return false;
    }
    return true;
}