import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { IUserContext, UserContext } from '../../context/userContext';
import './Confirm.css';
import { Button } from '../Button';
import Confetti from 'react-confetti';

export default function Confirm() {
  const { token } = useParams<{ token: string }>() || {};
  const { confirmAccount } = useContext(UserContext) as IUserContext;
  const [confirmationMessage, setConfirmationMessage] = useState("Invalid token");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchConfirmation = async () => {
      if (!token) {
        console.error('Token is missing!');
        return;
      }
      const response = await confirmAccount(token as string);
      if (response.status === 200) {
        setConfirmationMessage(response.message);
        setIsSuccess(true);
      }
    };

    fetchConfirmation();
  }, [token, confirmAccount]);

  return (
    <div className="confirm-container">
      {isSuccess && <Confetti numberOfPieces={100} />}
      <div
        className="confirm-main-text"
        style={{ color: isSuccess ? 'green' : 'white' }}
      >
        {confirmationMessage}
      </div>
      {isSuccess && <Button linkTo="/login" type="button" buttonStyle="btn--primary" buttonSize="btn--large">
        Login
      </Button>}
    </div>
  );
}
