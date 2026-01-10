import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
// Fontos: Az onSnapshot-ot a firestore-ból kell importálni
import { onSnapshot } from 'firebase/firestore'; 
import { auth, createUserProfileDocument } from './firebase/firebase.utils.js';
import { createStructuredSelector } from 'reselect';
import './App.css';
import Header from './components/header/header.component.jsx';
import HomePage from './pages/homepage/home-page.component.jsx';
import ShopPage from './pages/shop/shop.component.jsx';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component.jsx';
import { setCurrentUser } from './redux/user/user.actions';
import CheckoutPage from './pages/checkout/checkout.component';

import { selectCurrentUser } from './redux/user/user.selectors';

class App extends React.Component {

  unsubscribeFromAuth = null;

  componentDidMount() {
    const { setCurrentUser } = this.props;
    // Az auth.onAuthStateChanged marad a régi, mert a 'auth' objektum már inicializálva van
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        // ✅ JAVÍTÁS: userRef.onSnapshot helyett onSnapshot(userRef, ...)
        onSnapshot(userRef, (snapShot) => {
            setCurrentUser({
              id: snapShot.id,
              ...snapShot.data()
            });          
        });
      } 

      setCurrentUser(userAuth);
      
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
        <Header />
        <Routes>
          <Route exact path='/' element={<HomePage />} />
          <Route path='/shop' element={<ShopPage />} />
          <Route exact path='/checkout' element={<CheckoutPage />} />
          <Route
            path='/signin'
            element={
              this.props.currentUser ? (
                <Navigate to='/' replace />
              ) : (
                <SignInAndSignUpPage />
              )
            }
          />
        </Routes>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});
export default connect(mapStateToProps, mapDispatchToProps)(App);