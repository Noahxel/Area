import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext, IUserContext } from '../../context/userContext';
import './Login.css';
import Input from '../Input';
import Title from '../Title';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordPage, setPasswordPage] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { signIn, token } = useContext(UserContext) as IUserContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await signIn(email, password);
      if (response.message) {
        setMessage(response.message);
      }
    } catch (err) {
      setError('Failed to login.');
    }
  };

  if (passwordPage) {
    return (<Navigate to="/reset-password" />)
  }

  if (token) {
    return <Navigate to="/applets" replace />;
  }

  return (
    <div className="login-container">
      <div className='login-main-container'>
      <form className='login-form'>
        <div className='login-title'>
        <Title title='Log in' />
        </div>
        <Input onChange={(e) => setEmail(e.target.value)} placeholder='Email' type='email' value={email}/>
        <Input onChange={(e) => setPassword(e.target.value)} placeholder='Password' type='password' value={password}/>
        {message && <div className="login-response-message">{message}</div>}
        {error && <p>{error}</p>}
        <div className='forgot-password underline-text' onClick={() => setPasswordPage(true)} >Forgot your password ?</div>
        <button type="button" className="btn btn--primary-inverted btn--large" onClick={handleSubmit}>Log in</button>
        <div className='login-auth' >Continue with <a href="https://api.techparisarea.com/auth/google" className='underline-text'>Google</a></div>
      </form>
      </div>
    </div>
  );
};

export default Login;
