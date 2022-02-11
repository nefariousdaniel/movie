require('dotenv').config()
const express = require("express")
const req = require('express/lib/request')
const mysql = require("mysql")

const app = express()

app.use(express.static('public'))
app.use("/storage",express.static('storage'))

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "moviesapp"
});

connection.connect(err=>{
    if(err) console.log("Error Connecting to Database",err);
    console.log("Database Connected");
});



connection.query('CREATE DATABASE IF NOT EXISTS movies', function (error) {
  if (error) throw error;
});


app.get('/api/getMovieList', (req, res) => {
    let partQuery = "";
    if(req.query.genre != 0){
        partQuery = partQuery + ` AND genres.id = ${req.query.genre} `
    }
    if(req.query.language != 0){
        partQuery = partQuery + ` AND languages.id = ${req.query.language} `
    }

    let query = `select movies.id,title from movies inner join genres inner join languages where title LIKE '%${req.query.search}%'
    AND movies.genre = genres.id AND movies.language = languages.id
    ${partQuery}
    LIMIT ${req.query.limit} OFFSET ${req.query.offset}`;

    connection.query(query, function (error,result) {
        res.send(result);
    });
})


app.get('/api/getGenres',(req,res)=>{
    let query = `select * from genres`;
    connection.query(query,(err,result)=>{
        res.send(result);
    })
})
app.get('/api/getLanguages',(req,res)=>{
    let query = `select * from languages`;
    connection.query(query,(err,result)=>{
        res.send(result);
    })
})


app.listen(process.env.PORT, () => {
    console.log(`App is running on port: ${process.env.PORT}`)
});