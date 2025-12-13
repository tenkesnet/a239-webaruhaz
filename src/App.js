import './App.css';
import HomePage from './pages/homepage/home-page.component.jsx';
import ShopPage from './pages/shop/shop.component.jsx';
import { Route, Routes, useParams  } from 'react-router-dom';

const Teszt = () => {
  const params = useParams();
  console.log(params);
  return <h1>Teszt oldal</h1>;
}


const App = () => {
  return (
    <div>
      <Routes>
        <Route exact path='/' element={ <HomePage />} />
        <Route path='/shop' element={ <ShopPage />} />      
      </Routes>      
    </div>
  );
}

export default App;
