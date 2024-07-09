import "./App.css";
import { Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import ChatScreen from "./screens/ChatScreen/ChatScreen";

function App() {
  return (
    <div className="App">
      <Route path="/" component={HomeScreen} exact />
      <Route path="/chats" component={ChatScreen} />
    </div>
  );
}

export default App;
