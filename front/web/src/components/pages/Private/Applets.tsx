import React, { useContext, useEffect, useState } from 'react';
import './Applets.css';
import { Navigate } from 'react-router-dom';
import { IUserContext, UserContext } from '../../../context/userContext';
import axios from 'axios';
import { postService } from '../../../interfaces/postArea';
import SearchBar from '../../SearchBar';
import { aboutService } from '../../../interfaces/aboutDotJson';

interface AppletProps {
  item: postService;
  setReload: React.Dispatch<React.SetStateAction<number>>
  services: any
}

const Applet: React.FC<AppletProps> = ({ services, item, setReload }) => {
  const [status, setStatus] = useState(item.isActive);
  const { token } = useContext(UserContext) as IUserContext;
  const currentService = services.find((service: aboutService) => service.name === item.trigger.service);
  let logos: string[] = [];

  logos.push(item.trigger.service);
  for (let i = 0; i < item.actions.length; i++) {
    const service = item.actions[i].service;
    if (!logos.includes(service)) {
      logos.push(service);
    }
  }

  const toogleStatus = async () => {
    try {
      const response = await axios.put(`https://api.techparisarea.com/areas/${item._id}/switch_activation`, { id: item._id }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 200) {
        setStatus(!status)
      }
    } catch (error) {
      console.error("Error while fetching areas");
    }
  }

  const deleteApplet = async () => {
    const response = await axios.delete(`https://api.techparisarea.com/areas/${item._id}`, { headers: { Authorization: `Bearer ${token}` } });
    if (response.status === 200) {
      setReload(Math.random())
    } else {
      console.log("cannot get areas, resonse: ", response.status)
    }
  }

  function adjustHexColor(hex: string, percent: number): string {
    const threshold = 128;

    hex = hex.replace(/^#/, '');

    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    let lighten = brightness < threshold;

    if (lighten) {
      r = Math.floor(r + (255 - r) * (percent / 100));
      g = Math.floor(g + (255 - g) * (percent / 100));
      b = Math.floor(b + (255 - b) * (percent / 100));
    } else {
      r = Math.floor(r * (100 - percent) / 100);
      g = Math.floor(g * (100 - percent) / 100);
      b = Math.floor(b * (100 - percent) / 100);
    }

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return `#${(r < 16 ? '0' : '')}${r.toString(16)}${(g < 16 ? '0' : '')}${g.toString(16)}${(b < 16 ? '0' : '')}${b.toString(16)}`;
  }

  return (
    <div className="applet-content-holder" style={{ backgroundColor: status === true ? currentService.color : "#565656" }}>
      <div className='applet-content-container' style={{ width: `${logos.length * 15}%` }}>
        {logos.map((item, index) => (
          <img style={index === 0 ? { marginLeft: 0 } : {}} alt={item} className="applet-logo" src={`${process.env.PUBLIC_URL}/servicesLogo/${item}.png`} key={index}></img>
        ))}
      </div>
      <div className="applet-description">
        <div>{item.area_description ? item.area_description : ''}</div>
      </div>
      <div className='bottom-btn-container'>
        <button className="delete-applet" onClick={deleteApplet}>
          <img className="delete-applet-img" src={`${process.env.PUBLIC_URL}/bin.png`} alt="Delete"></img>
        </button>
        <button
          className={status === true ? "applet-status-on" : "applet-status-off"}
          style={{ backgroundColor: status === true ? adjustHexColor(currentService.color, 20) : "#D2D2D2" }}
          onClick={toogleStatus}
        >
          <div className={`applet-status-ball ${status === true ? 'translated' : ''}`}></div>
        </button>
      </div>
    </div>
  );
}

export default function Applets() {
  const [searchInput, setSearchInput] = useState('');
  const [areas, setAreas] = useState<postService[]>([]);
  const [reload, setReload] = useState(0);
  const [unauthenticated, setUnauthenticated] = useState(false);
  const [services, setServices] = useState<any>();

  const { setToken, token } = useContext(UserContext) as IUserContext;

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        const queryParams = new URLSearchParams(window.location.search);
        const tempToken = queryParams.get('token');
        if (tempToken) {
          console.log("Received google token : ", tempToken);
          setToken(tempToken);
        } else {
          setUnauthenticated(true);
        }
      }
    }

    const fetchData = async () => {
      let token = localStorage.getItem('userToken');
      try {
        const response = await axios.get('https://api.techparisarea.com/about.json', { headers: { Authorization: `Bearer ${token}` } });
        if (response.data.server.services) {
          setServices(response.data.server.services)
        }
      } catch (error) {
        console.error("Error while fetching areas");
      }
    }
    fetchData();
    checkToken();
  }, []);

  useEffect(() => {
    const getApplets = async () => {
      const response = await axios.get('https://api.techparisarea.com/areas', { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 200) {
        setAreas(response.data)
      } else {
        console.log("cannot get areas, resonse: ", response.status)
      }
    }
    if (token) {
      getApplets()
    }
  }, [reload])

  if (unauthenticated) {
    return (<Navigate to={"/"} />)
  }
  return (
    <div className="applets-container" key={reload}>
      <div className="applets-msg-holder">
        <p className="applets-msg">My Areas</p>
      </div>
      <div className='applets-searchbar'>
        <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} items={areas} name={['trigger.service', 'actions[0].service']} setItems={setAreas} />
      </div>
      <div className="applets-holder">
        <div style={{ opacity: 0.5 }}>{areas.length > 0 ? '' : 'No areas created for now'}</div>
        {services ?
          areas.map((item, index) => (
            <Applet services={services} setReload={setReload} key={index} item={item} />
          ))
          : ''
        }
      </div>
    </div>
  );
}
