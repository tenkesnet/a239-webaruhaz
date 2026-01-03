import React from 'react';
import { Route, Routes } from 'react-router-dom';
// Fontos: Az onSnapshot-ot a firestore-ból kell importálni
import { onSnapshot } from 'firebase/firestore'; 
import { auth, createUserProfileDocument } from './firebase/firebase.utils.js';

import './App.css';
import Header from './components/header/header.component.jsx';
import HomePage from './pages/homepage/home-page.component.jsx';
import ShopPage from './pages/shop/shop.component.jsx';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component.jsx';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      currentUser: null
    };
  }

  unsubscribeFromAuth = null;

  componentDidMount() {
    // Az auth.onAuthStateChanged marad a régi, mert a 'auth' objektum már inicializálva van
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        // ✅ JAVÍTÁS: userRef.onSnapshot helyett onSnapshot(userRef, ...)
        onSnapshot(userRef, (snapShot) => {
          this.setState({
            currentUser: {
              id: snapShot.id,
              ...snapShot.data()
            }
          }, () => {
            // A setState aszinkron, így a callback-ben érdemes logolni, ha látni akarod a változást
            console.log("Bejelentkezett felhasználó:", this.state.currentUser);
          });
        });
      } else {
        // Ha userAuth null (kijelentkezés), akkor a state is legyen null
        this.setState({ currentUser: userAuth });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribeFromAuth) {
      this.unsubscribeFromAuth();
    }
  }

  render() {
    return (
      <div>
        {/* A Header-nek átadhatod a currentUser-t a state-ből */}
        <Header currentUser={this.state.currentUser} />
        <Routes>
          <Route exact path='/' element={<HomePage />} />
          <Route path='/shop' element={<ShopPage />} />
          <Route path='/signin' element={<SignInAndSignUpPage />} />
        </Routes>
      </div>
    );
  }
}

export default App;