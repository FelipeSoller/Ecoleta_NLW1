const express = require("express")
const server = express()

// public folder configuration
server.use(express.static("public"))

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

// application path configuration - Search Results
server.get("/search-results", (req, res) => {
    return res.render("search-results.html")
})

// turn on server
server.listen(3000)

