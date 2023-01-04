import React from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";

const Navigation = () => {
  return (
    <div className="navigation">
      <ul>
        <Menu inverted fluid>
          <Menu.Item link>
            <NavLink
              to="/"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              <li>Accueil</li>
            </NavLink>
          </Menu.Item>

          <Menu.Item link>
            <NavLink
              to="/about"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              <li> À-propos</li>
            </NavLink>
          </Menu.Item>
        </Menu>
      </ul>
    </div>
  );
};

export default Navigation;
