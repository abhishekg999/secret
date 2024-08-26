import Home from './components/Home';
import View from './components/View';
import { isValidUUID } from './lib/utils';


const App = () => {
  const hash = window.location.hash.substring(1);
  if (!isValidUUID(hash) && window.location.pathname !== '/') {
    window.location.replace('/');
  }

  return (
    <>
      {isValidUUID(hash) ? <View hash={hash} /> : <Home />}
    </>
  );
}
export default App;