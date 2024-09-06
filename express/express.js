require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
require("express-async-errors");

const app = express();

app.use(express.json());

app.use(morgan("combined"));

let planets = [
  {
    id: 1,
    name: "Earth",
  },
  {
    id: 2,
    name: "Mars",
  },
];

app.get("/planets", (req, res) => {
  res.json(planets);
});

app.use((req, res) => {
  res.status(404).send("Not Found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
