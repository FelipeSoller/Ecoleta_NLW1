const express = require("express")
const server = express()

// Geting database
const db = require("./database/db.js")

// public folder configuration
server.use(express.static("public"))

// enable the use of the application's req.body
server.use(express.urlencoded({ extended: true }))

// working with egine template
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

// application path configuration - Initial Page
// req = requisition / res = answer
server.get("/", (req, res) => {
    return res.render("index.html")
})

// application path configuration - Create Point
server.get("/create-point", (req, res) => {
    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

    // inserting data in database
    const query = `
        INSERT INTO places (
            image, 
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?, ?, ?, ?, ?, ?, ?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no cadastro")
        }
        console.log("Cadastrado com sucesso");
        console.log(this);   
        
        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)    
})

// application path configuration - Search Results
server.get("/search-results", (req, res) => {

    const search = req.query.search

    if (search == "") {
        // empty search        
        return res.render("search-results.html", { total: 0 })
    }



    // get data from database
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if (err) {
            return console.log(err)
        }

        const total = rows.length
        
        // show the html page with data from database
        return res.render("search-results.html", { places: rows, total: total})
    })   
})

// turn on server
server.listen(3000)

