// index.js
const moment = require("moment");

// Example: Change this to your birthdate (YYYY-MM-DD)
const birthDate = moment("2000-08-28", "YYYY-MM-DD");  

// Get today's date
const today = moment();

// Calculate age
const years = today.diff(birthDate, "years");
const months = today.diff(birthDate, "months") % 12;
const days = today.diff(birthDate.clone().add(years, "years").add(months, "months"), "days");

// Print results
console.log(`You are ${years} years, ${months} months, and ${days} days old.`);
