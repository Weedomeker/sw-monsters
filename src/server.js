const express = require("express");
const axios = require("axios");
const cors = require("cors");
const PORT = 5000;
const app = express();
const baseUrl = "https://swarfarm.com/api/v2/";

app.use(cors());

app.get("/monsters", (req, res) => {
  axios
    .get(baseUrl + "monsters")
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.listen(PORT, () => {
  console.log(`Server start on port: ${PORT}`);
});
