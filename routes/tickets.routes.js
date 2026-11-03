const express = require("express")
const router = express.Router()
const Ticket = require("../models/Ticket.js")
const isSignedIn = require("../middleware/is-signed-in.js")

// Every route in this file requires the user to be signed in
router.use(isSignedIn)

//CRUD

// CREATE: show the form (must stay above "/:id")
router.get("/new", (req, res) => {
    res.render("ticket/new.ejs")
})

// CREATE: save the ticket
router.post("/", async (req, res) => {
    try{
        req.body.owner = req.session.user._id // the signed-in user owns the ticket
        await Ticket.create(req.body)
        res.redirect("/tickets")
    }catch (error){
        console.log(error)
        res.redirect("/tickets/new")        
    }
})


// READ: list only MY tickets, newest first
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find({ owner: req.session.user._id }).sort({ createdAt: -1 })
    res.render("tickets/index.ejs", { tickets })
  } catch (error) {
    console.log(error)
    res.redirect("/")
  }
})

// READ: one ticket, only if it belongs to me
router.get("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ _id: req.params.id, owner: req.session.user._id })
    if (!ticket) return res.redirect("/tickets")
    res.render("tickets/show.ejs", { ticket })
  } catch (error) {
    console.log(error)
    res.redirect("/tickets")
  }
})


// UPDATE:





// DELETE:



module.exports = router
