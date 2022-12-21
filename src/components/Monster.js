import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import Card from "./Card";

function Monster() {
  const [monsters, setMonsters] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonsters = async () => {
      let allMonsters = [];
      let nextPage = `${config.baseUrl}/monsters`;

      while (nextPage) {
        try {
          const res = await axios.get(nextPage);
          allMonsters = allMonsters.concat(res.data.results);
          nextPage = res.data.next;
        } catch (err) {
          console.error(err);
          setError(new Error("An error occurred while fetching monsters"));
          setLoading(false);
          return;
        }
      }

      setLoading(false);
      setMonsters(allMonsters);
    };

    fetchMonsters();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
      }}
    >
      {monsters.length > 0 ? (
        monsters.map((monster) => <Card key={monster.id} monster={monster} />)
      ) : (
        <p>No monsters found</p>
      )}
    </div>
  );
}

export default Monster;
