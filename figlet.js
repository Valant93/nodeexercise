const figlet = require('figlet');


figlet('Hello, World!', (err, data) => {
    if (err) {
        console.log('ERRORE...');
        console.dir(err);
        return;
    }
    console.log(data);
});