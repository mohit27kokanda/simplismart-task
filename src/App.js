import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./component/HomePage/Homepage";
import ModelSpacePage from "./component/ModalSpacePage/ModalSpacePage";
import Layout from "./component/Layout/Layout";
import "./index.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/model-space/:id" element={<ModelSpacePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
