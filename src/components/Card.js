import React from "react";

const Card = ({ monster }) => {
  return (
    <div>
      <img
        style={{
          width: "80px",
          padding: "4px",
          borderRadius: "10px 10px",
          border: "1px solid ##9FC6FF",
          backgroundColor: "transparent",
        }}
        src={`https://swarfarm.com/static/herders/images/monsters/${monster.image_filename}`}
        alt={monster.name}
      />
    </div>
  );
};

export default Card;
