import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './components/Home';
import Admin from "./components/Admin";
import Helper from "./components/Helper";

const Routes = () => (
  <Router>
    <Route exact path="/id=:id" component={Home} />
    {/* <Route exact path="/admin" component={Admin} /> */}
  </Router>
);

export default Routes;