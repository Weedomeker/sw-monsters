import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input, Progress } from "semantic-ui-react";
import Card from "./Card";
import isDev from "../isDev";
import ricaLoading from "../assets/img/loading/ricaLoader.gif";
import lushenLoading from "../assets/img/loading/lushenLoader.gif";
import endLoading from "../assets/img/loading/endLoading.gif";
import startLoading from "../assets/img/loading/startLoading.gif";

function Monster() {
  const [monsters, setMonsters] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [rangeValue, setRangeValue] = useState(100);
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
      let nextPage = `/monsters`;

      while (nextPage) {
        try {
          const res = await axios.get(nextPage);
          if (res.data.results) {
            allMonsters = allMonsters.concat(res.data.results);
            setProgress(
              Math.round((allMonsters.length / res.data.count) * 100)
            );
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

      const filteredMonsters = allMonsters.filter((monster) => {
        return monster.obtainable;
      });
      setLoading(false);
      setMonsters(filteredMonsters);
      console.log(isDev ? "Development" : "Production");
      !isDev && localStorage.setItem("monsters", JSON.stringify(allMonsters));
    };
    fetchMonsters();
  }, []);

  if (loading) {
    const switchImg = () => {
      let className = "image";
      if (progress > 0 && progress <= 25) {
        className += " show";
        return <img src={startLoading} alt="loading" className={className} />;
      } else if (progress > 25 && progress <= 50) {
        className += " show";
        return <img src={ricaLoading} alt="loading" className={className} />;
      } else if (progress > 50 && progress <= 75) {
        className += " show";
        return <img src={lushenLoading} alt="loading" className={className} />;
      } else if (progress > 75 && progress <= 100) {
        className += " show";
        return <img src={endLoading} alt="loading" className={className} />;
      } else {
        return;
      }
    };

    return (
      <div className="loading">
        {switchImg()}
        <Progress percent={progress} indicating>
          <h2>
            Chargement des monstres en cours:
            <p>{progress} %</p>
          </h2>
        </Progress>
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
  const changeColorButton = () => {
    switch (selectedRadio) {
      case "Fire":
        return "orange";
      case "Water":
        return "blue";
      case "Wind":
        return "yellow";
      case "Dark":
        return "purple";
      case "Light":
        return "";
      default:
        return "";
    }
  };

  return (
    <div className="monsters">
      <ul className="radio-container">
        {/* Input Text Selection */}
        <li>
          <Input
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

        <li>
          {/* Range Selection */}
          <label htmlFor="rangeSelect" className="labelRange">
            Monstres affiché(s):
            {
              monsters
                .filter(
                  (monster) =>
                    monster.element.includes(selectedRadio) &&
                    monster.name.includes(inputSearch)
                )
                .slice(0, rangeValue).length
            }
          </label>
          <br />
          <input
            name="rangeSelect"
            type="range"
            min="1"
            max={monsters.length}
            step="1"
            maxLength="200"
            defaultValue={rangeValue}
            onChange={(e) => {
              setRangeValue(e.target.value);
            }}
          />
        </li>
        {/* Radio Selection */}
        {radio.map((element, i) => (
          <li key={i}>
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
      <div className="buttonAnnuler">
        {selectedRadio && (
          <Button
            compact
            inverted
            color={changeColorButton()}
            onClick={() => {
              setSelectedValue("");
            }}
          >
            Annuler la recherche
          </Button>
        )}
      </div>

      <ul className="monster-render">
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
      </ul>
    </div>
  );
}

export default Monster;
