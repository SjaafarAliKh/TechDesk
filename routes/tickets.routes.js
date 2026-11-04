const express = require("express")
const router = express.Router()
const Ticket = require("../models/Ticket.js")
const isSignedIn = require("../middleware/is-signed-in.js")

// Every route in this file requires the user to be signed in
router.use(isSignedIn)

//CRUD

// CREATE: show the form (must stay above "/:id")
router.get("/new", (req, res) => {
  res.render("tickets/new.ejs")
})

// CREATE: save the ticket
router.post("/", async (req, res) => {
  try {
    req.body.owner = req.session.user._id // the signed-in user owns the ticket
    await Ticket.create(req.body)
    res.redirect("/tickets")
  } catch (error) {
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

// UPDATE: show the edit form
router.get("/:id/edit", async (req, res) => {
  try {
    const ticket = await Ticket.findOne(
      { _id: req.params.id, owner: req.session.user._id }
    )
    if (!ticket) return res.redirect("/tickets")
    res.render("tickets/edit.ejs", { ticket })
  } catch (error) {
    console.log(error)
    res.redirect("/tickets")
  }
})

// UPDATE: save the changes
router.put("/:id", async (req, res) => {
  try {
    // Take only the fields we allow, 
    // so nobody can change "owner" through the form
    const { title, description, category, priority, status } = req.body

    const ticket = await Ticket.findOneAndUpdate(
      { _id: req.params.id, owner: req.session.user._id },
      { title, description, category, priority, status },
      { runValidators: true }
    )

    if (!ticket) return res.redirect("/tickets")
    res.redirect(`/tickets/${req.params.id}`)
  } catch (error) {
    console.log(error)
    res.redirect("/tickets")
  }
})


// DELETE: remove the ticket and its comments
router.delete("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndDelete({_id: req.params.id, owner: req.session.user._id})
    if (ticket){
      await Comment.deleteMany({ ticket: ticket._id }) // no orphan comments
    }
    res.redirect("/tickets")
  } catch (error) {
    console.log(error)
    res.redirect("/tickets")
  }
})

// COMMENT: add a comment to a ticket



module.exports = router
