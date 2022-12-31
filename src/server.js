require("dotenv").config();
const express = require("express");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");
const axios = require("axios");
const cors = require("cors");
const PORT = process.env.SERVER_PORT || 8000;
const app = express();
const baseUrl = "https://swarfarm.com/api/v2/";

app.use(cors());
app.use(
  "/",
  createProxyMiddleware({
    target: "https://sw-monsters-weedo.herokuapp.com/",
    changeOrigin: true,
  })
);

app.use(express.static(path.resolve(__dirname, "../build")));

app.get("/favicon.ico", (req, res) => {
  res.sendStatus(204).end();
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
  res.cookie("Monsters", "", { maxAge: 5 * 60 * 1000, sameSite: "lax" });
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

app.get("/*", (req, res) => {
  res.json({
    news: "/news/",
    monsters: "/monsters/",
    "monster-sources": "/monster-sources/",
    skills: "/skills/",
    "skill-effects": "/skill-effects/",
    "leader-skills": "/leader-skills/",
    "homunculus-skills": "/homunculus-skills/",
    items: "/items/",
    fusions: "/fusions/",
    buildings: "/buildings/",
    dungeons: "/dungeons/",
    levels: "/levels/",
    "profiles/upload": "/profiles/upload/",
    "profiles/sync": "/profiles/sync/",
    "profiles/accepted-commands": "/profiles/accepted-commands/",
    profiles: "/profiles/",
    data_logs: "/data_logs/",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});
