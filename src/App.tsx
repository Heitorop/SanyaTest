import React from "react";
import "./App.css";
import SelectParent from "./components/SelectParent";
import UploaderParent from "./components/UploaderParent";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SelectParent />
        <UploaderParent />
      </header>
    </div>
  );
}

export default App;
