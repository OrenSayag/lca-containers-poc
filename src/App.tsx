import "./App.css";
import Stage from "./components/Stage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { containers } from "./services/testing-hardcoded.service";

function App() {
  return (
    <div dir={"rtl"}>
      <BrowserRouter>
        <Routes>
          <Route path={":uuid?"} element={<Stage containers={containers} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
