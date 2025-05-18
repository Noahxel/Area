import React, { useContext, useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { UserContext } from '../../../context/userContext';
import { Navigate } from 'react-router-dom';
import { Button } from '../../Button';
import './Account.css';
import { SERVICE_COLORS } from '../../../servicesColors'
import ConfirmationModal from '../../ConfirmationModal';
import Title from '../../Title';
import Input from '../../Input';


const AccountPage: React.FC = () => {
  const [connectedServices, setConnectedServices] = useState<string[]>([]);
  const [disconnectingService, setDisconnectingService] = useState<string | null>(null);
  const userContext = useContext(UserContext);
  const [message, setMessage] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    oldPassword: '',
    newPassword: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [serviceToDisconnect, setServiceToDisconnect] = useState<string | null>(null);

  const handleShowModal = (service: string) => {
    setShowModal(true);
    setServiceToDisconnect(service);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setServiceToDisconnect(null);
  };

  const handleDisconnectConfirm = async () => {
    if (serviceToDisconnect) {
      await handleDisconnect(serviceToDisconnect);
    }
    handleCloseModal();
  };

  useEffect(() => {
    if (!formData.username && !formData.email && userContext?.getUserInfo) {
      userContext.getUserInfo().then(data => {
        if (data) {
          setFormData({
            username: data.username,
            email: data.email,
            oldPassword: '',
            newPassword: '',
          });
          setConnectedServices(data.connectServices);
        }
      });
    }
  }, [userContext, formData]);

  if (!userContext) {
    throw new Error("AccountPage must be used within a UserContextProvider");
  }

  const { token, signOut, updateInfo } = userContext;

  if (!token) {
    return <Navigate to="/" />;
  }

  const handleDisconnect = async (service: string) => {
    setDisconnectingService(service);
    const response = await userContext?.disconnectService(service);
    if (response && response.status === 200) {
      const updatedServices = connectedServices.filter(s => s !== service);
      setConnectedServices(updatedServices);
    }
    const updatedServices = connectedServices.filter(s => s !== service);
    setConnectedServices(updatedServices);
    setDisconnectingService(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await updateInfo(formData.email, formData.username, formData.oldPassword, formData.newPassword);
    console.log(response.message)
    setMessage(response.message);
    setStatusCode(response.status);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      await userContext.deleteUser();
      signOut();
    }
  };

  return (
      <div className="account-container">
        <form className='account-form'>
          <Title title='Account settings' className='account-title' />

          <div className="account-input-titles">
            <label htmlFor="username" className="input-title">Username</label>
            <Input type='text' value={formData.username} onChange={handleInputChange} required name='username' />
          </div>
          <div className="account-input-titles">
            <label htmlFor="username" className="input-title">Email</label>
            <Input type='email' name='email' value={formData.email} required onChange={handleInputChange} />
          </div>
          <div className="account-input-titles">
            <label htmlFor="username" className="input-title">Old Password</label>
            <Input type='password' name='oldPassword' required onChange={handleInputChange} />
          </div>
          <div className="account-input-titles">
            <label htmlFor="username" className="input-title">New Password</label>
            <Input type='password' name='newPassword' required onChange={handleInputChange} />
          </div>
          <div className={`api-response-message ${statusCode === 200 ? 'success-message' : 'error-message'}`}>
            {message}
          </div>

          <Button buttonSize='btn--large' buttonStyle='btn--primary-inverted' type='button' onClick={handleSubmit} >Update Infos</Button>
        </form>
        <Button buttonSize={'btn--medium'} buttonStyle='btn--primary-inverted' type='button' onClick={signOut} >Logout</Button>
        <div className='vertical-spacer'></div>
        <Button buttonSize={'btn--medium'} buttonStyle='btn--outline' type="button" color="red" onClick={handleDeleteAccount}>
          <FaTrash className="bin-icon" />&nbsp;&nbsp;&nbsp;Delete Account
        </Button>
        <div className='big-vertical-spacer'></div>
        <div className="connected-services-container">
          {/*  <div className="connected-services-title">Connected services</div> */}
          <Title className='account-title' title='Connected services' />
          <div className="services-list">
            {connectedServices.length === 0 ? (
              <div className="service-item no-service" style={{ backgroundColor: 'lightgray' }}>
                <div className="no-service-content">
                  No services
                </div>
              </div>
            ) : (
              connectedServices.map(service => (
                <div
                  key={service}
                  className="service-item"
                  style={{ backgroundColor: SERVICE_COLORS[service] || 'defaultColor' }}
                  onMouseEnter={() => setDisconnectingService(service)}
                  onMouseLeave={() => setDisconnectingService(null)}
                  onClick={() => handleShowModal(service)}
                >
                  <div className="service-content">
                    <img src={`/servicesLogo/${service}.png`} alt={`${service} logo`} />
                    {disconnectingService === service ? "Delete" : service.charAt(0).toUpperCase() + service.slice(1)}
                  </div>
                </div>
              ))
            )}
            {showModal && serviceToDisconnect && (
              <ConfirmationModal
                service={serviceToDisconnect}
                onConfirm={handleDisconnectConfirm}
                onCancel={handleCloseModal}
              />
            )}
          </div>

        </div>

      </div>
  );
};

export default AccountPage;
