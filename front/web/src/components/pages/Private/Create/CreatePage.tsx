import { UserContext } from "../../../../context/userContext";
import { useContext, useState } from 'react';
import { Navigate } from "react-router-dom";
import Create from "./Create";
import Services from "./Services";
import ServiceActions from "./ServiceAction";

export default function CreatePage() {
  const [currentPage, setCurrentPage] = useState('create')
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("Private must be used within a UserContextProvider");
  }

  const { token } = userContext;

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="create-container">
      {
        currentPage === "create" ? <Create setCurrentPage={setCurrentPage}></Create> :
        currentPage === "services" ? <Services setCurrentPage={setCurrentPage}></Services> :
        <ServiceActions setCurrentPage={setCurrentPage} currentPage={currentPage}></ServiceActions>
      }
    </div>
  );
}