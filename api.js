const express = require("express");
const app = express();
let db = require("./dataBase");

app.use(express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/static/index.html");
});

app.get("/api/addresses/", (req, res) => {
  res.json(db);
});

app.post("/api/addresses/", (req, res) => {
  const newAddress = {
    id: Math.floor(Date.now() * Math.random()),
    name: req.body.name,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
  };

  db.push(newAddress);

  res
    .status(201)
    .setHeader("location", `/api/addresses/${newAddress.id}`)
    .json(newAddress)
});

app.delete("/api/addresses/:id", (req, res) => {
  const address = db.find((data) => data.id == req.params.id);
  if (!address) {
    res.status(404).send("Not Found");
  } else {
    db = db.filter((data) => data.id != req.params.id);
    res.status(204).send("No content");
  }
});

app.patch("/api/addresses/:id", (req, res) => {
  let updateAddress = db.find((data) => data.id == req.params.id);

  if (!updateAddress) {
    res.status(404).send("Not Found");
  } else {
    updateAddress.name = req.body.name;
    updateAddress.street = req.body.street;
    updateAddress.city = req.body.city;
    updateAddress.state = req.body.state;

    res.status(200).json(updateAddress);
  }
});

module.exports = app;
