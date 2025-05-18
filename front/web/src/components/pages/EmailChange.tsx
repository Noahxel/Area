import { useContext, useEffect, useState } from "react";
import Title from "../Title";
import Confetti from "react-confetti";
import { useParams } from "react-router-dom";
import "./EmailChange.css";
import { IUserContext, UserContext } from "../../context/userContext";

export default function EmailChange() {
  const { token } = useParams<{ token: string }>() || {};
  const { confirmEmailChange } = useContext(UserContext) as IUserContext;
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmailChange = async () => {
      if (!token) {
        console.error("Token is missing!");
        return;
      }
      const response = await confirmEmailChange(token as string);
      if (response.status === 200) {
        setTitle(response.message);
        setIsSuccessful(true);
      } else {
        setError(response.message);
      }
    };
    fetchEmailChange();
  }, [token, confirmEmailChange]);

  return (
    <div className="email-change-container">
    <div className="email-change-main-container">
      <Title title={isSuccessful ? title : error} />
      {isSuccessful && <Confetti className="confetti" numberOfPieces={100} />}
      </div>
    </div>
  );
}
