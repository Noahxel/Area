import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../Button';
import { FaBars, FaTimes } from 'react-icons/fa';
import './AuthenticatedNavbar.css';


function Navbar() {
  const [button, setButton] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();

    const handleResize = () => {
      showButton();
      if (window.innerWidth > 960) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const location = useLocation();
  const isInverted = location.pathname === '/';
  const logoSrc = isInverted ? `${process.env.PUBLIC_URL}/logo_white.png` : `${process.env.PUBLIC_URL}/logo_black.png`;

  return (
    <>
      <nav className={isInverted ? 'navbar' : 'navbar-inverted'}>
        <div className="navbar-logo-container">
          <Link to="/applets" className="navbar-logo">
            <img src={logoSrc} alt="Logo" className="logo" />
          </Link>
          {button ? <button className="get-apk-button" onClick={() => window.location.href = `${process.env.PUBLIC_URL}/apk/app-release.apk`}>Download App</button> : ""}
        </div>

        <div className="menu-icon" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes color={isInverted ? "white" : "#1D1D1D"} /> : <FaBars color={isInverted ? "white" : "#1D1D1D"} />}
        </div>

        {mobileMenuOpen && (
          <ul className="nav-menu active">
            <Link to='/applets' className='nav-links' onClick={closeMobileMenu}>
              My Areas
            </Link>
            <Link to='/create' className='nav-links' onClick={closeMobileMenu}>
              Create
            </Link>
            <div onClick={toggleMobileMenu} style={{width: '100%', marginTop: '4%', marginBottom: '4%'}}>
              <Button linkTo="/account" type="button" buttonStyle={isInverted ? 'btn--primary' : 'btn--primary-inverted'} buttonSize={!button ? "btn--large" : "btn--medium"}>
                Account
              </Button>
            </div>
            {!button ? <button className="get-apk-button" onClick={() => window.location.href = `${process.env.PUBLIC_URL}/apk/app-release.apk`}>Download App</button> : ""}
          </ul>
        )}

        <div className="navbar-container">
          <Link to='/applets' className='nav-links'>
            My Areas
          </Link>
          <Link to='/create' className='nav-links'>
            Create
          </Link>
          <Button linkTo="/account" type="button" buttonStyle={isInverted ? 'btn--primary' : 'btn--primary-inverted'} buttonSize="btn--medium">
            Account
          </Button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
