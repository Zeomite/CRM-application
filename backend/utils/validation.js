const customer = require("../models/customer");

exports.isValidCustomer = ({ email, password}) =>{
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
      return {
          message: "Enter Valid email address",
      };

  }

  if(password.length < 8){
      return {
          message: "Password too short (min 8 characters)",
      };
  }
  // Return true or some other value if all conditions are met
  return true;
};
