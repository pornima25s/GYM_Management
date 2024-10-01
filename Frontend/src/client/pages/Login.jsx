import React from 'react';

import { gapi } from 'gapi-script'
import '../../public/css/Login.css';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginBtn from '../components/loginBtn';
import LoginToast from '../components/loginToast';
import axios from 'axios';
<script src="https://apis.google.com/js/platform.js" async defer></script>



const clientId = "796411994962-2uhaa7a0obchg0ukk0oirgor4a56ghlh.apps.googleusercontent.com"

function Login() {

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ''
      })
    };

    gapi.load('client:auth2', start);
  })

  const [userName, setUserName] = useState('')
  const [psw, setPsw] = useState('')
  const [error, setError] = useState('')
  const [loginSuccess, setLoginSuccess] = useState(false)

  const handlePswChange = (e) => {
    setPsw(e.target.value);
  };

  const loginSubmit = async (e) => {
    e.preventDefault();

    if (psw.length < 8) {

      var charNo = 8 - psw.length;
      toast.warning('You are missing ' + charNo + ' characters in your password!', {
        position: toast.POSITION.TOP_RIGHT,
          theme: 'dark'
      });
      return;
    }

    const logUser = { userName, psw }
    const options = {
      headers: {
      'Content-Type': 'application/json'
    }}
    await axios.post('/api/loginformdata',JSON.stringify(logUser), options)
    .then(res=>{
   
      if (res.data.role === 'Admin') {
        toast.success('Wellcome, '+ userName+ '!', {
          position: toast.POSITION.TOP_RIGHT,
          theme: 'dark'
        });

        console.log("Cookies has been created. Passing alpha : " + Cookies.get('sessionName'))

        setError(null)
        console.log('AdminUser logged in')
        setTimeout(function () {
          window.location.href = '/AdminMainPage'
        }, 2500);

      

      } else {
        /*
        toast.success('Logged in successfully !', {
          position: toast.POSITION.TOP_RIGHT,
          theme: 'dark',
        
        });
        */
        setLoginSuccess(true)
       
        console.log("Cookies has been created: " + Cookies.get('sessionName'))

        setError(null)

        console.log('User logged in')
        
        setTimeout(function () {
          window.location.href = '/MyAccount'
        }, 2500);
      
      }
    })
    .catch(()=>{
     
      toast.error('Login credentials are invalid. Please try again', {
        position: toast.POSITION.TOP_RIGHT,
          theme: 'dark'
      });
    })
   
   
  }

  return (
    <div className='bodyoflogin'>

      <div>
        <ToastContainer autoClose={1500} />
        <div className="login-form">

          <form onSubmit={loginSubmit}>
            <div className="login-header">
              <h1 className='logtxt'>LOGIN</h1><br />
              <p className='paralogin'>Login to access to your account and use our features</p>
            </div>
            <div className="login-body">
              <div className="form-group">
                <label htmlFor="text" style={{ color: 'white' }}>Username</label>
                <input type="text" onChange={(e) => setUserName(e.target.value)} value={userName} required placeholder='Jhon Doe' />
              </div>
              <div className="form-group">
                <label htmlFor="password" style={{ color: 'white' }}>Password</label>
                <input type="password" onChange={handlePswChange} value={psw} required placeholder='********' />
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <button type="submit" className='loginbttn'>Login</button>
              </div>
              <div className="form-group">
                <LoginBtn />
              </div>
            </div>
          </form>
        </div>
      </div>
      {loginSuccess && <LoginToast />}
    </div>

  );
}

export default Login;
