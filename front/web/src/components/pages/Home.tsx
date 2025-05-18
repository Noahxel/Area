import React, { useContext } from 'react';
import './Home.css';
import { Button } from '../Button';
import Title from '../Title';
import { UserContext, IUserContext } from '../../context/userContext';
import { Navigate } from 'react-router-dom';

export default function Home() {
  const {token} = useContext(UserContext) as IUserContext;

  if (token)
    return (
  <Navigate to={"/applets"} />)

  return (
    <div className="home-container">
      <div className='home-main-container'>
      <Title title="Automation for business and home" />
      <div className="home-sub-text">Save time and get more done</div>
      <div className='home-button-container'>
      <Button linkTo="/register" type="button" buttonStyle="btn--primary" buttonSize="btn--large">
        Start today
      </Button>
      </div>
      </div>
    </div>
  );
}
