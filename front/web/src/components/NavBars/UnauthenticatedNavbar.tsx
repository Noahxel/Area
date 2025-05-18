import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../Button';
import { FaBars, FaTimes } from 'react-icons/fa';
import './UnauthenticatedNavbar.css';

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
  const isInverted = location.pathname === '/' || location.pathname.startsWith('/auth/confirm/');
  const logoSrc = isInverted ? `${process.env.PUBLIC_URL}/logo_white.png` : `${process.env.PUBLIC_URL}/logo_black.png`;


  return (
    <>
      <nav className={isInverted ? 'navbar' : 'navbar-inverted'}>
        <div className="navbar-logo-container">
          <Link to="/" className="navbar-logo">
            <img src={logoSrc} alt="Logo" className="logo" />
          </Link>
          {button ? <button className="get-apk-button" onClick={() => window.location.href = `${process.env.PUBLIC_URL}/apk/app-release.apk`}>Download App</button> : ""}
        </div>

        <div className="menu-icon" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes color={isInverted ? "white" : "#1D1D1D"} /> : <FaBars color={isInverted ? "white" : "#1D1D1D"} />}
        </div>

        {mobileMenuOpen && (
          <ul className="nav-menu active">
              <Link to='/login' className='nav-links' onClick={closeMobileMenu}>
                Log in
              </Link>
              <Button linkTo="/register" type="button" buttonStyle={isInverted ? 'btn--primary' : 'btn--primary-inverted'} buttonSize={!button ? "btn--large" : "btn--medium"}>
                Get started
              </Button>
              {!button ? <button className="get-apk-button" onClick={() => window.location.href = `${process.env.PUBLIC_URL}/apk/app-release.apk`}>Download App</button> : ""}
          </ul>
        )}

        <div className="navbar-container">
          <Link to='/login' className={isInverted ? 'unauth-nav-links' : 'unauth-nav-links-inverted'}>
            Log in
          </Link>
          <Button linkTo="/register" type="button" buttonStyle={isInverted ? 'btn--primary' : 'btn--primary-inverted'} buttonSize="btn--medium">
            Get started
          </Button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
