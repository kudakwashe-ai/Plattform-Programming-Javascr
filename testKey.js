const axios = require('axios');

// Key extracted from your screenshot
const key = '1f4fcff11e85adc625f0f6e5c908234f';

console.log("Testing API Key:", key);

axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${key}&query=batman`)
    .then(response => {
        console.log("SUCCESS! The key works.");
        console.log("Found:", response.data.results[0].title);
    })
    .catch(error => {
        console.log("FAILURE! The key was rejected.");
        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Message:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.log("Error:", error.message);
        }
    });
