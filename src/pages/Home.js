import React from "react";
//import Monster from "../components/Monster";
import Navigation from "../components/Navigation";
const Monster = React.lazy(() => import("../components/Monster"));
const Home = () => {
  return (
    <div>
      <Navigation />
      <React.Suspense fallback={<div>Loading Monsters....</div>}>
        <Monster />
      </React.Suspense>
    </div>
  );
};

export default Home;
