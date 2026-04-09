import Home from "./components/Home";
import View from "./components/View";
import { isValidUUID } from "./lib/crypto";

const App = () => {
  const path = window.location.pathname.endsWith("/")
    ? window.location.pathname.slice(0, -1)
    : window.location.pathname;

  if (isValidUUID(path.slice(1))) {
    return <View hash={path.slice(1)} />;
  }

  if (path === "") {
    return <Home />;
  }

  window.location.replace("/");
  return null;
};

export default App;
