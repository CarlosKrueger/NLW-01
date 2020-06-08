import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import CreateEcopoint from "./pages/CreateEcopoint";

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Home} path="/" exact />
      <Route component={CreateEcopoint} path="/create-ecopoint" />
    </BrowserRouter>
  );
};

export default Routes;
