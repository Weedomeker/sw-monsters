import React, { Suspense } from "react";

const Card = ({ monster }) => {
  const imgApi = `https://swarfarm.com/static/herders/images/monsters/${monster.image_filename}`;

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
        src={imgApi}
        alt={monster.name}
      />
    </div>
  );
};

export default Card;
