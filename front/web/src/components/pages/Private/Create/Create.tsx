import { Outlet } from "react-router-dom";
import './Create.css';
import React, { useEffect, useState } from 'react';
import { postService } from "../../../../interfaces/postArea";
import { aboutService } from "../../../../interfaces/aboutDotJson";
import axios from "axios";
import { getBetterNames } from "./ServiceAction";
import { Navigate } from 'react-router-dom';
import { getLocalSelectedArea } from "../../../../interfaces/postArea";
import { Store } from "react-notifications-component";

interface IftttProps {
  ifttt_name: string;
  is_current: boolean;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  selectedArea: postService
  JSONservices: aboutService[]
  index: number
  refreshPageContent: () => void;
}

const IftttSquare: React.FC<IftttProps> = ({ ifttt_name, is_current, setCurrentPage, selectedArea, JSONservices, index, refreshPageContent }) => {
  var serviceName = ''
  var action = ''
  var services

  if (ifttt_name === "If This" && selectedArea.trigger && selectedArea.trigger.name.length > 0) {
    serviceName = selectedArea.trigger.service
    action = selectedArea.trigger.name
    ifttt_name = "If"
  }
  if (ifttt_name === "Then That" && selectedArea.actions && selectedArea.actions[index].name.length > 0) {
    serviceName = selectedArea.actions[index].service
    action = selectedArea.actions[index].name
    ifttt_name = "Then"
  }

  let actionName = getBetterNames(action)

  if (JSONservices) {
    const serv = JSONservices.find((JSONservice: aboutService) => JSONservice.name === serviceName);
    if (serv)
      services = serv
  }

  var color = services ? services.color : (!is_current ? '#BCBCBC' : '#000000')

  const deleteStep = () => {
    if (index === -1) {
      selectedArea.trigger = {
        service: '',
        name: '',
        parameters: []
      }
      localStorage.removeItem('selectedArea')
      localStorage.removeItem('selectedIngredients');
      refreshPageContent()
      return;
    }
    if (index >= 0) {
      if (index === 0 && selectedArea.actions.length === 1) {
        selectedArea.actions[0] = {
          service: '',
          name: '',
          parameters: []
        }
      }
      if (selectedArea.actions.length > 1) {
        selectedArea.actions.splice(index, 1)
      }
    }
    localStorage.setItem('selectedArea', JSON.stringify(selectedArea));
    refreshPageContent()
  }

  return (
    <div className='ifttt-rectangle' style={{ backgroundColor: color }}>
      <div className='ifttt-rectangle-text'>{ifttt_name}</div>
      {is_current && !services ?
        <div className="ifttt-add-btn-link">
          <button className='add-action-btn' onClick={() => { setCurrentPage("services"); }}>
            Add
          </button>
        </div>
        : ''}
      {services ?
        <>
          <img
            alt="logo"
            style={{ width: '30px', margin: '20px' }}
            src={services ? require(`../../../../../public/servicesLogo/${services.name}.png`) : ''}
          />
          <div className="create-action-name-container">
            <div className="create-action-name">
              {actionName}
            </div>
          </div>
        </>
        : ''}
      {((!services && (index > 0 || selectedArea.actions.length > 1) && !(index === -1 && selectedArea.trigger.name === '')) || (services)) ?
          <button className="ifttt-delete-applet" onClick={deleteStep}>
            <img className="delete-applet-img" src={`${process.env.PUBLIC_URL}/bin.png`} alt="Delete"></img>
          </button>
        : ''}
    </div>
  );
}

interface CreateProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const Create: React.FC<CreateProps> = ({ setCurrentPage }) => {
  const [current, setCurrent] = useState('this')
  const [selectedArea, setSelectedArea] = useState<postService>()
  const [services, setServices] = useState<aboutService[]>([])
  const [error, setError] = useState('')
  const [requestIsGood, setRequestIsGood] = useState(false)
  const [refresh, setRefresh] = useState(0)

  const refreshPageContent = () => {
    let area = getLocalSelectedArea()
    setSelectedArea(area)
    if (area.trigger && area.trigger.name.length > 0)
      setCurrent('that')
    else {
      setCurrent('this')
    }
    setRefresh(Math.random())
  }

  useEffect(() => {
    const getURL = () => {
      const queryParams = new URLSearchParams(window.location.search);
      const tempConnect = queryParams.get("connect");
      const tempService = queryParams.get("service");
      if (tempService) {
        setCurrentPage(tempService);
      }
      if (tempConnect === "error") {
        Store.addNotification({
          title: "Error",
          message: "Unexpected error occurred.",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
      }
    };
    let area = getLocalSelectedArea()
    setSelectedArea(getLocalSelectedArea())
    if (area.trigger && area.trigger.name.length > 0)
      setCurrent('that')

    const fetchAboutJSON = async () => {
      let token = localStorage.getItem('userToken');
      try {
        const response = await axios.get('https://api.techparisarea.com/about.json', { headers: { Authorization: `Bearer ${token}` } });
        if (response.data) {
          let service = response.data.server.services;
          setServices(service);
        }
      } catch (error) {
        console.error("Error while fetching areas");
      }
    }
    getURL();
    fetchAboutJSON();
  }, [])

  const resetCreation = () => {
    localStorage.removeItem('selectedArea')
    localStorage.removeItem('selectedIngredients');
    refreshPageContent()
  }

  const addBlankAction = () => {
    selectedArea?.actions.push({
      service: '',
      name: '',
      parameters: []
    })
    localStorage.setItem('selectedArea', JSON.stringify(selectedArea));
    setRefresh(Math.random())
  }

  const setCreation = async () => {
    setError('')
    let area = getLocalSelectedArea()
    let token = localStorage.getItem('userToken')
    try {
      const response = await axios.post('https://api.techparisarea.com/areas', area, { headers: { Authorization: `Bearer ${token}` } })
      if (response.status === 200) {
        setRequestIsGood(true)
        localStorage.removeItem('selectedArea')
        localStorage.removeItem('selectedIngredients');
      } else {
        setError(response.data.message)
      }
    } catch (error: any) {
      setError(error.response.data.message)
    }
    console.log(selectedArea)
  }

  if (requestIsGood) {
    return <Navigate to="/applets" replace />;
  }

  if (!selectedArea)
    return <></>

  return (
    <div className="ifttt-container" key={refresh}>
      <Outlet />
      <div className='ifttt'>
        <IftttSquare JSONservices={services} ifttt_name='If This' selectedArea={selectedArea} is_current={current === 'this' ? true : false} setCurrentPage={setCurrentPage} index={-1} refreshPageContent={refreshPageContent}></IftttSquare>
        {selectedArea.actions.map((item, index) => (
          <React.Fragment key={index}>
            <div className='ifttt-link-line'></div>
            <IftttSquare
              JSONservices={services}
              ifttt_name='Then That'
              selectedArea={selectedArea}
              is_current={current === 'that' ? true : false}
              setCurrentPage={setCurrentPage}
              index={index}
              refreshPageContent={refreshPageContent}
              key={index}
            />
          </React.Fragment>
        ))}

        <div className='ifttt-error-message'>{error !== '' ? error : ''}</div>
        {selectedArea.actions && selectedArea.actions[selectedArea.actions.length - 1].name.length > 0 && selectedArea.trigger.name.length > 0 ?
          <>
            <button className='add-then-button' style={{ marginLeft: 0, border: '1px solid' }} onClick={() => { addBlankAction() }}>
              +
            </button>
            <div className="ifttt-add-btn-link" style={{ justifyContent: 'space-around', marginBottom: '5%' }}>
              <button className='add-action-btn' style={{ marginLeft: 0, border: '1px solid' }} onClick={() => { setCreation() }}>
                Add
              </button>
              <div className="horizontal-spacer"></div>
              <button className='add-action-btn' style={{ marginLeft: 0, border: '1px solid' }} onClick={() => { resetCreation() }}>
                Reset
              </button>
            </div>
          </>
          : ''}
      </div>
    </div>
  );
}

export default Create
