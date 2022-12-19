import React from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";

const Navigation = () => {
  return (
    <div
      style={{
        color: "orangered",
        flexDirection: "column",
        alignContent: "center",
      }}
    >
      <Menu inverted tabular fluid stackable>
        <Menu.Item link>
          <NavLink to="/" style={{ color: "orangered", fontSize: "24px" }}>
            Accueil
          </NavLink>
        </Menu.Item>

        <Menu.Item link>
          <NavLink
            to="/about"
            style={{ color: "lightskyblue", fontSize: "24px" }}
          >
            À-propos
          </NavLink>
        </Menu.Item>
        <Menu.Item position="right"></Menu.Item>
      </Menu>
    </div>
  );
};

export default Navigation;
