import React, { Component } from "react";
import "./App.scss";
import View from "./components/View";
import Panel from "./components/Panel";

class App extends Component {
  render() {
    return (
      <div className="App">
        <View>
          <Panel />
        </View>
      </div>
    );
  }
}

export default App;
