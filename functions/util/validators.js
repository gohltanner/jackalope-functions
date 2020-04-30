//////////////////////////////////////
/////////////////////////////////////
const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};
//////////////////////////////////////
/////////////////////////////////////
const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};
//////////////////////////////////////
/////////////////////////////////////
exports.validateSignupData = (data) => {
  let errors = {};
  if (isEmpty(data.email)) {
    errors.email = "Please enter your information";
  } else if (!isEmail(data.email)) {
    errors.email = "Please enter a valid email address";
  }
  if (isEmpty(data.password)) errors.password = "Please enter your information";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords do not match";
  if (isEmpty(data.handle)) errors.handle = "Please enter your information";
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
//////////////////////////////////////
/////////////////////////////////////
exports.validateLoginData = (data) => {
  let errors = {};
  if (isEmpty(data.email)) errors.email = "Please enter your information";
  if (isEmpty(data.password)) errors.password = "Please enter your information";
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
//////////////////////////////////////
/////////////////////////////////////
exports.reduceUserDetails = (data) => {
  let userDetails = {};
  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    // https://website.com
    if (data.website.trim().substring(0, 4) !== "http") {
      userDetails.website = `http://${data.website.trim()}`;
    } else userDetails.website = data.website;
  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;
  return userDetails;
};
//////////////////////////////////////
/////////////////////////////////////
