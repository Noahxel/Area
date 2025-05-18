import React, { useEffect, useRef, useState } from 'react';
import './Services.css';
import axios from 'axios';
import { ServiceOAuthConstants } from '../../../../interfaces/serviceConnect';
import { getServiceAuthorizeByName } from '../../../../interfaces/serviceConnect';
import { postService } from '../../../../interfaces/postArea';
import { getLocalSelectedArea } from '../../../../interfaces/postArea';
import SearchBar from '../../../SearchBar';
import { aboutService } from '../../../../interfaces/aboutDotJson';

interface ServicesProps {
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

interface ServiceProps {
    serviceInfos: aboutService;
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const Service: React.FC<ServiceProps> = ({ serviceInfos, setCurrentPage }) => {
    const [serviceOAuthConstants, setServiceOAuthConstants] = useState<ServiceOAuthConstants | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [selectedArea, setSelectedArea] = useState<postService>()
    let initialName = serviceInfos.name;
    const upperName = initialName[0].toUpperCase() + initialName.slice(1);
    const image = require(`../../../../../public/servicesLogo/${initialName}.png`);
    const token = localStorage.getItem('userToken');
    const popup = useRef<any>();

    const checkConnect = async () => {
        const response = await axios.get('https://api.techparisarea.com/profile', { headers: { Authorization: `Bearer ${token}` } });
        if (response.status === 200) {
            if (response.data.connectServices.includes(initialName)) {
                setIsConnected(true)
                if (popup.current !== undefined)
                    popup.current.close()
            }
        } else {
            console.error("Cannot get user datas")
        }
    }

    useEffect(() => {
        const getDatas = async () => {
            await checkConnect()
            setSelectedArea(getLocalSelectedArea())
        }
        getDatas();
    }, [])

    useEffect(() => {
        if (!isConnected) {
            let serviceAuthorize = getServiceAuthorizeByName(initialName)

            if (serviceOAuthConstants && serviceAuthorize) {
                const serviceURL = new URL(serviceAuthorize);
                serviceURL.searchParams.append("client_id", serviceOAuthConstants.clientId);
                serviceURL.searchParams.append("response_type", "code");
                serviceURL.searchParams.append("redirect_uri", serviceOAuthConstants.redirectUri);
                serviceURL.searchParams.append("scope", serviceOAuthConstants.scopes.join(" "));
                serviceURL.searchParams.append("state", serviceOAuthConstants.oAuthSessionId);
                window.location.href = serviceURL.href;
            }
        } else {
            setCurrentPage(initialName)
        }
    }, [serviceOAuthConstants])

    const getOAuthConstants = async () => {
        const headers = {
            Authorization: `Bearer ${token}`
        };

        try {
            const response = await axios.get(`https://api.techparisarea.com/connect/get${upperName}OAuthConstants`, { headers: headers });
            if (response.status === 200) {
                setServiceOAuthConstants(response.data);
            }
        } catch (error) {
            console.error("Error fetching Service OAuth constants:", error);
        }
    }

    const selectArea = async () => {
        checkConnect()
        if (!isConnected) {
            if (!getServiceAuthorizeByName(initialName)) {
                setCurrentPage(initialName)
            } else {
                await getOAuthConstants()
            }
        } else {
            setCurrentPage(initialName)
        }
    }

    return (
        <button className='selection-button' onClick={() => { selectArea() }}>
            <div className="service-content-holder" style={{ backgroundColor: serviceInfos.color }}>
                <div className="service-logo-holder">
                    <img alt="logo" className="service-logo" src={image}></img>
                </div>
                <div className="service-description">
                    <div>{upperName}</div>
                </div>
            </div>
        </button>
    );
}

const Services: React.FC<ServicesProps> = ({ setCurrentPage }) => {
    const [searchInput, setSearchInput] = useState('');
    const [services, setServices] = useState<aboutService[]>([]);
    let realServices: aboutService[] = [];
    const [selectedArea, setSelectedArea] = useState<postService>()

    useEffect(() => {
        const fetchData = async () => {
            let token = localStorage.getItem('userToken');
            try {
                const response = await axios.get('https://api.techparisarea.com/about.json', { headers: { Authorization: `Bearer ${token}` } });
                if (response.data) {
                    setServices(response.data.server.services)
                }
            } catch (error) {
                console.error("Error while fetching areas");
            }
        }
        setSelectedArea(getLocalSelectedArea())
        fetchData();
    }, []);

    if (selectedArea) {
        for (let i = 0; i < services.length; i++) {
            if (selectedArea.trigger.name.length > 0) {
                if (services[i].actions.length > 0) {
                    realServices.push(services[i])
                }
            } else {
                if (services[i].triggers.length > 0) {
                    realServices.push(services[i])
                }
            }
        }
    }
    if (realServices.length === 0)
        return <></>

    return (
        <div className='services-main-container'>
            <div className='cancel-bar'>
                <button className='back-button' onClick={() => { window.location.href = "https://techparisarea.com/create"; setCurrentPage("create") }}>
                    Cancel
                </button>
            </div>
            <div className='thin-line'></div>
            <div className="services-container">
                <div className='service-txt' style={{marginTop: '2%', marginBottom: '2%'}}>Choose a service</div>
                <div className='service-searchbar' style={{ marginBottom: "2rem" }}>
                    <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} items={services} setItems={setServices} name={['name']} />
                </div>
                    {realServices.map((service, index) => (
                        <Service
                            key={index}
                            serviceInfos={service}
                            setCurrentPage={setCurrentPage}
                        />
                    ))}
                </div>
            </div>
    );
}

export default Services