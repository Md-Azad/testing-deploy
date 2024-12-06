const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

// MIDDLEWARES
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`the server is running on: "http://localhost:${port}"`);
});
