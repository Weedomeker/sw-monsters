const express = require("express");
const axios = require("axios");
const cors = require("cors");
const PORT = 5000;
const app = express();
const baseUrl = "https://swarfarm.com/api/v2/";

app.use(cors());

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
  console.log(`Server started on port: ${PORT}`);
});
