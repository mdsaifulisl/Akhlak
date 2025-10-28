
const mySQL = require("mysql2");



// const db = mySQL.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: "akhlak",
// });

const db = mySQL.createConnection({
    host: "localhost",
    user: "reliable_akhlak",
    password: "{jamif,,f&q08v]!",
    database: "reliable_akhlak",
});


db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Db Connected!");
    }
});

module.exports = db;

