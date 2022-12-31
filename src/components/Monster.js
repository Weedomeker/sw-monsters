import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader, Button, Input } from "semantic-ui-react";
import Card from "./Card";
let SERVER_HOSTNAME;
SERVER_HOSTNAME = process.env.REACT_APP_BACKEND_BASEURL;
console.log(process.env.NODE_ENV);
function Monster() {
  const [monsters, setMonsters] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rangeValue, setRangeValue] = useState(36);
  const [selectedRadio, setSelectedValue] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const radio = ["Fire", "Water", "Wind", "Dark", "Light"];

  useEffect(() => {
    const fetchMonsters = async () => {
      // Vérifie si les données sont déjà présentes dans le cache
      const cachedMonsters = localStorage.getItem("monsters");
      if (cachedMonsters) {
        // Si oui, utilise les données du cache
        const filtredCachedMonsters = JSON.parse(cachedMonsters).filter(
          (monster) => {
            return monster.obtainable;
          }
        );
        setMonsters(filtredCachedMonsters);
        setLoading(false);
        return;
      }

      let allMonsters = [];
      let nextPage = `${SERVER_HOSTNAME}/monsters`;

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
            nextPage = `${SERVER_HOSTNAME}/monsters/page/${page}`;
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

      const filteredMonsters = allMonsters.filter((monster) => {
        return monster.obtainable;
      });
      setLoading(false);
      setMonsters(filteredMonsters);
      localStorage.setItem("monsters", JSON.stringify(allMonsters));
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

  const uniqueMonsters = Array.from(
    new Set(monsters.map((monster) => monster.name))
  );
  const suggestions = uniqueMonsters.map((monsterName) => {
    return { title: monsterName };
  });

  return (
    <div className="monsters">
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          alignContent: "center",
        }}
      >
        {/* Input Text Selection */}
        <li style={{ paddingRight: "25px" }}>
          <Input
            size="mini"
            id="monster-search"
            list="monsters"
            placeholder="Rechercher un monstre..."
            defaultValue={inputSearch}
            onChange={(e) => {
              setInputSearch(e.target.value);
            }}
          />
          <datalist id="monsters">
            {suggestions.map((suggestion, index) => (
              <option
                key={`${index}: ${suggestion.title}`}
                value={suggestion.title}
              />
            ))}
          </datalist>
        </li>

        {/* Range Selection */}
        <input
          type="range"
          min="1"
          max="2078"
          step="0.5"
          maxLength="200"
          defaultValue={rangeValue}
          onChange={(e) => setRangeValue(e.target.value)}
        />
        {/* Radio Selection */}
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
        {selectedRadio && (
          <Button
            compact
            inverted
            color="orange"
            size="mini"
            onClick={() => {
              setSelectedValue("");
            }}
          >
            Annuler la recherche
          </Button>
        )}
      </ul>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
        }}
      >
        {monsters.length > 0 ? (
          monsters
            .filter(
              (monster) =>
                monster.element.includes(selectedRadio) &&
                monster.name.includes(inputSearch)
            )
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
