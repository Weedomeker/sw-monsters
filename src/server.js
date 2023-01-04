const express = require("express");
const cookieSession = require("cookie-session");
const path = require("path");
const axios = require("axios");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();
const baseUrl = "https://swarfarm.com/api/v2/";

app.use(cors());
app.use(
  cookieSession({
    name: "session",
    secret: "OrpheaBestGuildEver",
    cookie: {
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24h
    },
  })
);
app.use(express.static(path.resolve(__dirname, "../build")));
app.use("/assets", express.static(path.join(__dirname, "../public/assets")));

app.get("/favicon.ico", (req, res) => {
  res.sendStatus(204).end();
});

app.get("/images/monsters/:route", (req, res) => {
  const imageURL = "https://swarfarm.com/static/herders/images/monsters/";
  const route = req.params.route;

  axios
    .get(`${imageURL}${route}`, { responseType: "arraybuffer" })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => console.log(error));

  // const arrayBuffer = await axios.get(`${imageURL}${route}`, {
  //   responseType: "arraybuffer",
  // });
  // let buffer = Buffer.from(arrayBuffer.data, "binary").toString("base64");
  // let image = `data:${arrayBuffer.headers["content-type"]};base64,${buffer}`;
  // res.send(`<img src="${image}" alt="${route}"/>`);
});

app.get("/:route", (req, res) => {
  const route = req.params.route;
  axios
    .get(`${baseUrl}${route}`)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(`Error fetching ${route} data`);
    });
});

app.get("/monsters/page/:page", (req, res) => {
  const page = req.params.page;
  axios
    .get(`${baseUrl}monsters/?page=${page}`)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(`Error fetching monsters data for page ${page}`);
    });
});
app.get("/", (res, req) => {
  res.sendFile("../build/index.html");
});

app.listen(PORT, () => {
  console.log(`Server running at port:${PORT}`);
});
