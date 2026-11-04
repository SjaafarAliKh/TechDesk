// Replace every <time class="js-date"> with a date in the device's own time zone
document.querySelectorAll("time.js-date").forEach((el) => {
  const date = new Date(el.getAttribute("datetime"))

  const options = { day: "2-digit", month: "short", year: "numeric" }
  if (el.dataset.format === "datetime") {
    options.hour = "2-digit"
    options.minute = "2-digit"
  }

  el.textContent = date.toLocaleString("en-GB", options)
})