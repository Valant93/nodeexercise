const crypto = require('crypto');
const randomID = crypto.randomBytes(16).toString('hex');  
console.log(randomID);