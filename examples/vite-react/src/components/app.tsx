import { configure } from "onedollarstats";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../index.css";
import Home from "./home";
import Page2 from "./page-2";

export function App() {
  // Run this only in the browser
  useEffect(() => {
    configure({ trackLocalhostAs: "example.com" });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/page-2'
          element={<Page2 />}
        />
      </Routes>
    </BrowserRouter>
  );
}
