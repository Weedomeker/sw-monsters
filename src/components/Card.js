import React from "react";
import isDev from "../isDev";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import starIconNoAwake from "../assets/img/stars/star-unawakened.png";
import starIconAwake from "../assets/img/stars/star-awakened.png";
import starIcon2Awake from "../assets/img/stars/star-awakened2.png";

const srcMap = [starIconNoAwake, starIconAwake, starIcon2Awake];
const altMap = ["star-unawakened", "star-awakened", "star-unawakened2"];

const Card = ({ monster }) => {
  const imgApi = `${
    isDev ? "http://localhost:5000/images/monsters/" : "/images/monsters/"
  }${monster.image_filename}`;
  const starsIcon = Array.from({ length: monster.base_stars }).map(() => (
    <img
      key={Math.random() * monster.id}
      src={srcMap[monster.awaken_level]}
      alt={altMap[monster.awaken_level]}
    />
  ));

  return (
    <li className="card">
      <LazyLoadImage
        src={imgApi}
        alt={monster.name}
        height={80}
        width={80}
        effect="opacity"
      />

      <div className="infos">
        <h2>{monster.name}</h2>
        <div className="stars">{starsIcon}</div>
        <p>{monster.archetype}</p>
      </div>
    </li>
  );
};

export default Card;
