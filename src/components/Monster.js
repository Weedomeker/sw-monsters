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
          if (res.data.results) {
            allMonsters = allMonsters.concat(res.data.results);
          }
          if (res.data.next) {
            // Extract page number from next URL
            const page = res.data.next.match(/page=(\d+)/)[1];
            // Reconstruct next URL using base URL of server and route
            nextPage = `${config.baseUrl}/monsters/page/${page}`;
          } else {
            nextPage = null;
          }
        } catch (err) {
          console.error(err);
          let errorMessage =
            "Une erreur s'est produite lors de la récupération des monstres";
          if (err.response) {
            errorMessage += `: ${err.response.status}`;
            if (err.response.data && err.response.data.error) {
              errorMessage += ` - ${err.response.data.error}`;
            }
          }
          setError(new Error(errorMessage));
          setLoading(false);
          return;
        }
      }

      // Remove duplicates from allMonsters array
      const uniqueMonsters = allMonsters.filter((monster, index, self) => {
        return self.indexOf(monster) === index;
      });

      // Remove Korean elements from uniqueMonsters array
      const nonKoreanMonsters = uniqueMonsters.filter((monster) => {
        // Check if monster name or description exist and do not contain Korean characters
        return (
          !(monster.name && monster.name.match(/[\u3131-\uD79D]/g)) &&
          !(
            monster.description && monster.description.match(/[\u3131-\uD79D]/g)
          )
        );
      });

      const filteredMonsters = nonKoreanMonsters.filter((monster) => {
        return monster.obtainable;
      });
      setLoading(false);
      setMonsters(filteredMonsters);
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
