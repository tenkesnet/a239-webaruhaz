import './App.css';
import HomePage from './pages/homepage/home-page.component.jsx';
import { Route, Router  } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path='/' component={HomePage} />        
      </Switch>      
    </div>
  );
}

export default App;
