import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dimmer, Loader, Image, Segment } from "semantic-ui-react";
import Card from "./Card";

function Monster() {
  const [monsters, setMonsters] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rangeValue, setRangeValue] = useState(36);
  const [selectedRadio, setSelectedValue] = useState("");
  const radio = ["Fire", "Water", "Wind", "Dark", "Light"];
  const resetRadio = () => {
    setSelectedValue("");
  };

  useEffect(() => {
    const fetchMonsters = async () => {
      let allMonsters = [];
      let nextPage = `/monsters`;

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
            nextPage = `/monsters/page/${page}`;
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

      const filteredMonsters = uniqueMonsters.filter((monster) => {
        return monster.obtainable;
      });
      setLoading(false);
      setMonsters(filteredMonsters);
    };

    fetchMonsters();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Loader active inline="centered" size="big">
          Loading
        </Loader>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="monsters">
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          alignContent: "center",
        }}
      >
        <input
          type="range"
          min="1"
          max="2078"
          step="0.5"
          maxLength="200"
          defaultValue={rangeValue}
          onChange={(e) => setRangeValue(e.target.value)}
        />
        {radio.map((element, i) => (
          <li key={i} style={{ padding: "10px" }}>
            <input
              type="radio"
              id={element}
              name="elementRadio"
              checked={selectedRadio === element}
              onChange={(e) => {
                setSelectedValue(e.target.id);
              }}
            />
            <label htmlFor={element}>{element}</label>
          </li>
        ))}
      </ul>
      {selectedRadio && (
        <button
          onClick={() => {
            setSelectedValue("");
          }}
        >
          Annuler la recherche
        </button>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
        }}
      >
        {monsters.length > 0 ? (
          monsters
            .filter((monster) => monster.element.includes(selectedRadio))
            .slice(0, rangeValue)
            .map((monster) => <Card key={monster.id} monster={monster} />)
        ) : (
          <p>No monsters found</p>
        )}
      </div>
    </div>
  );
}

export default Monster;
