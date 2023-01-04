import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import About from "./pages/About";
//import Home from "./pages/Home";
const Home = React.lazy(() => import("./pages/Home"));

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <Home />
            </React.Suspense>
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/*"
          element={
            // <React.Suspense fallback={<div>Loading...</div>}>
            <Home />
            // </React.Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
