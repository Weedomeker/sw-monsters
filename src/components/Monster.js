import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "semantic-ui-react";
const baseUrl = "http://localhost:5000";

const Monster = () => {
  //States
  const [monstersData, setMonstersData] = useState([]);

  useEffect(() => {
    axios
      .get(baseUrl + "/monsters")
      .then((res) => {
        setMonstersData(res.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="monsters">
      <h1>Monsters</h1>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Nom</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Élément</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {monstersData.map((monster) => (
            <Table.Row key={monster.id}>
              <Table.Cell>
                <img
                  style={{ width: "60px" }}
                  src={`https://swarfarm.com/static/herders/images/monsters/${monster.image_filename}`}
                  alt={monster.name}
                />
              </Table.Cell>
              <Table.Cell>{monster.name}</Table.Cell>
              <Table.Cell>{monster.archetype}</Table.Cell>
              <Table.Cell>{monster.element}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Monster;
