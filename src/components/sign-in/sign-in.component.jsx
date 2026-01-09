import React, { use } from 'react';

import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';
import { signInWithGoogle, auth, createUserProfileDocument } from '../../firebase/firebase.utils';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './sign-in.styles.scss';

class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  handleSubmit = async event => {
  event.preventDefault();

  const { email, password } = this.state;

  try {
    // ✅ ÚJ MODULÁRIS SZINTAKTIKA:
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userRef = await createUserProfileDocument(userCredential.user);
    console.log("Bejelentkezett felhasználó:", userCredential.user);
    // Siker esetén ürítjük a mezőket
    this.setState({ email: '', password: '' });
  } catch (error) {
    // Érdemes lehet a felhasználónak is jelezni, ha rossz a jelszó
    console.error("Hiba a bejelentkezés során:", error.message);
  }
};

  handleChange = event => {
    const { value, name } = event.target;

    this.setState({ [name]: value });
  };

  render() {
    return (
      <div className='sign-in'>
        <h2>I already have an account</h2>
        <span>Sign in with your email and password</span>

        <form onSubmit={this.handleSubmit}>
          <FormInput
            name='email'
            type='email'
            handleChange={this.handleChange}
            value={this.state.email}
            label='email'
            required
          />
          <FormInput
            name='password'
            type='password'
            value={this.state.password}
            handleChange={this.handleChange}
            label='password'
            required
          />
           <div className='buttons'>
            <CustomButton type='submit'> Sign in </CustomButton>
            <CustomButton onClick={signInWithGoogle} isGoogleSignIn>
              Sign in with Google
            </CustomButton>
          </div>
        </form>
      </div>
    );
  }
}

export default SignIn;