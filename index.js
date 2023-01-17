const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const sessions = require("express-session")
const db = require("./db")
const socket = require("socket.io")
const ejs = require("ejs")

const app = express()
const server = app.listen(3000)
console.log("app is listening on port 3000")
const io = socket(server)


//-----Setup-----
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(sessions({
  secret: process.env.secret,
  saveUninitialized: true,
  cookie: { maxAge: 100 * 60 * 60 * 24 * 30 },
  resave: false
}))
app.use(cookieParser())
app.get("/", (req, res) => {
  res.render("index")
})

//-----Login-----
app.get("/userLogin", (req, res) => {
  db.query("SELECT * FROM users", [], (err, result) => {
    if (err) return err
    res.render("userLogin", { users : result.rows })
  })
})

app.get("/adminLogin", (req, res) => {
  if (req.session.userid) {
    res.redirect("adminMenu")
  } else {
    res.render("adminLogin", {status: req.session.message })
  }
})

app.post("/adminLogin", (req, res) => {
  if (req.body.user == process.env.username &&
      req.body.pass == process.env.password) {
    req.session.userid = req.body.user
    res.redirect("/adminMenu")
  } else {
    req.session.message = "invalid"
    res.redirect("/adminLogin")
  }
})

app.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy()
  }
  res.redirect("/")
})

//-----User Functionality-----
app.post("/userDashboard", (req, res) => {
  res.render("userDashboard", { name : req.body.name })
})


//-----Admin Functionality-----
app.get("/adminMenu", (req, res) => {
  res.render("adminMenu")
})

app.get("/manageUsers", (req, res) => {
  db.query("SELECT * FROM users", [], (err, result) => {
    if (err) return err
    res.render("manageUsers", { users : result.rows, status: null })
  })
})

app.post("/manageUsers", (req, res) => { 
  if (req.body.user.length > 0) {
    db.query("INSERT INTO users (name) VALUES ($1)", [req.body.user], (err, result) => {
      if (err) return err
      db.query("SELECT * FROM users", [], (err, result) => {
        if (err) return err
        res.render("manageUsers", { users : result.rows, status: null })
      })
    })
  } else {
    db.query("SELECT * FROM users", [], (err, result) => {
      if (err) return err
      res.render("manageUsers", { users : result.rows, status: "emptyName" })
    })
  }
})

app.delete("/manageUsers/delete", (req, res) => {
  db.query("DELETE FROM users WHERE id=$1", [req.body.id], (err, result) => {
    if (err) return err
    res.send({ })
  })
})

app.get("/viewMessages", (req, res) => {
  db.query("SELECT * FROM messages", [], (err, result) => {
    res.render("viewMessages", { messages: result.rows })
  })
})

//-----Websockets-----
io.sockets.on("connection", (socket) => {  
  console.log(socket.id)
  
  socket.on("send", (data) => {
    console.log(data)
    db.query("INSERT INTO messages (name, message) VALUES ($1, $2)", [data.name, data.message], (err, result) => {
      if (err) return err
      db.query("SELECT * FROM messages", [], (err, result) => {
        ejs.renderFile("views/messageTemplate.ejs", {messages: result.rows}, (error, str) => {
          if (error) return error
          socket.broadcast.emit("send", str)
        })
      })
    })
  })

  socket.on("resolve", (data) => {
    db.query("DELETE FROM messages WHERE id=$1", [data], (err, result) => {
      if (err) return err
      db.query("SELECT * FROM messages", [], (err, result) => {
        ejs.renderFile("views/messageTemplate.ejs", {messages: result.rows}, (error, str) => {
          if (error) return error
          io.emit("send", str)
        })
      })
    })
  })
})
