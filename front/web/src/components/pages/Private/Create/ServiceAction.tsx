import './ServiceAction.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { aboutService } from '../../../../interfaces/aboutDotJson';
import { postService } from "../../../../interfaces/postArea";
import { TriggerActions } from '../../../../interfaces/aboutDotJson';
import { getLocalSelectedArea } from '../../../../interfaces/postArea';
import { Ingredient } from '../../../../interfaces/aboutDotJson';
import Input from '../../../Input';

interface ServiceActionsProps {
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>
    currentPage: string
}

interface ServiceActionProps {
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>
    actionInfos: TriggerActions
    color: string
    currentPage: string
    selectedArea: postService
    setMode: React.Dispatch<React.SetStateAction<actionReactionInfos | undefined>>
}

interface actionReactionInfos {
    infos: TriggerActions
    type: string
}

export function getBetterNames(name: string) {
    let name_length = name.length
    let betterName = ''

    for (let i = 0; i < name_length; i++)
        betterName += (name[i] === '_' ? " " : name[i]);
    betterName = betterName[0]?.toUpperCase() + betterName.slice(1)

    return (betterName)
}

const ServiceAction: React.FC<ServiceActionProps> = ({ setMode, color, selectedArea, actionInfos, setCurrentPage, currentPage }) => {
    let clearname = getBetterNames(actionInfos.name)
    let whatami = ''

    console.log(actionInfos)

    const handleSelectionClick = () => {
        if (selectedArea.trigger && selectedArea.trigger.name.length > 0) {
            selectedArea.actions[selectedArea.actions.length - 1].service = currentPage
            selectedArea.actions[selectedArea.actions.length - 1].name = actionInfos.name
            whatami = 'actions'
        } else if (selectedArea.trigger) {
            selectedArea.trigger.name = actionInfos.name;
            selectedArea.trigger.service = currentPage;
            whatami = 'trigger'
        }

        if (actionInfos.parameters.length === 0)
            localStorage.setItem('selectedArea', JSON.stringify(selectedArea))

        if (selectedArea) {
            if (actionInfos.parameters.length !== 0) {
                if (actionInfos.ingredients) {
                    localStorage.setItem('selectedIngredients', JSON.stringify(actionInfos.ingredients))
                }
                setMode({ infos: actionInfos, type: whatami })
            } else {
                if (actionInfos.ingredients) {
                    localStorage.setItem('selectedIngredients', JSON.stringify(actionInfos.ingredients))
                }
                window.location.href = "https://techparisarea.com/create";
                setCurrentPage("create")
            }
        }
    }

    return (
        <button className='selection-action-button' onClick={() => { handleSelectionClick() }}>
            <div className="service-actions-content-holder" style={{ backgroundColor: color }}>
                <div className="service-action-name">
                    <div>{clearname}</div>
                </div>
                <div className="service-action-description">
                    {actionInfos.description}
                </div>
            </div>
        </button>
    );
}

const ServiceActions: React.FC<ServiceActionsProps> = ({ setCurrentPage, currentPage }) => {
    const [services, setServices] = useState<aboutService | undefined>();
    const [selectedArea, setSelectedArea] = useState<postService>()
    const [mode, setMode] = useState<actionReactionInfos | undefined>()
    const [ingredients, setIngredients] = useState<Ingredient[]>([])

    useEffect(() => {
        const fetchData = async () => {
            let token = localStorage.getItem('userToken');
            let area = getLocalSelectedArea()
            setSelectedArea(area)

            try {
                const response = await axios.get('https://api.techparisarea.com/about.json', { headers: { Authorization: `Bearer ${token}` } });
                if (response.data) {
                    let service = response.data.server.services;
                    const currentService = service.find((service: aboutService) => service.name === currentPage);

                    setServices(currentService);
                }
            } catch (error) {
                console.error("Error while fetching areas");
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const getIngredients = () => {
            let localIngredients = localStorage.getItem('selectedIngredients')
            if (localIngredients)
                setIngredients(JSON.parse(localIngredients))
        }
        getIngredients();
    }, [mode]);

    const [parametersInput, setParametersInput] = useState<string[]>([""]);
    const [parametersNames, setParametersNames] = useState<string[]>([""]);

    const submitParams = () => {
        if (mode && selectedArea) {
            for (let i = 0; i < mode.infos.parameters.length; i++) {
                if (mode.type === "trigger") {
                    selectedArea.trigger.parameters[i] = { name: parametersNames[i], input: parametersInput[i] }
                    if (parametersNames[i] === undefined || parametersInput[i] === undefined) {
                        selectedArea.trigger.parameters[i] = { name: mode.infos.parameters[i].name, input: "" }
                    }
                }
                if (mode.type === "actions") {
                    selectedArea.actions[selectedArea.actions.length - 1].parameters[i] = { name: parametersNames[i], input: parametersInput[i] }
                    if (parametersNames[i] === undefined || parametersInput[i] === undefined) {
                        selectedArea.actions[selectedArea.actions.length - 1].parameters[i] = { name: mode.infos.parameters[i].name, input: "" }
                    }
                }
            }
        }
        localStorage.setItem('selectedArea', JSON.stringify(selectedArea));
        window.location.href = "https://techparisarea.com/create";
        setCurrentPage("create")
    }

    const handleIngredientChange = (ingredientName: string, index: number, name: string) => {
        setParametersInput(prev => {
            const updatedInputs = [...prev];
            if (updatedInputs[index] === undefined) {
                updatedInputs[index] = `<${ingredientName}>`;
            } else
                updatedInputs[index] += `<${ingredientName}>`;
            return updatedInputs;
        });

        setParametersNames(prev => {
            const updatedNames = [...prev];
            updatedNames[index] = name;
            return updatedNames;
        });
    }

    const handleInputChange = (index: number, value: string, name: string) => {
        setParametersNames(prev => {
            const updatedNames = [...prev];
            updatedNames[index] = name;
            return updatedNames;
        });

        setParametersInput(prev => {
            const updatedInputs = [...prev];
            updatedInputs[index] = value;
            return updatedInputs;
        });
    }

    if (!services)
        return null

    let uppername = services.name[0]?.toUpperCase() + services.name.slice(1)

    return (
        <>
            <div className='cancel-bar' style={{ backgroundColor: services.color }}>
                <button className='back-button' style={{ color: 'white' }} onClick={() => {
                    if (mode && mode.infos.parameters.length > 0) {
                        for (let i = 0; i < parametersInput.length; i++) {
                            parametersInput[i] = ''
                            parametersNames[i] = ''
                        }
                        if (mode.type === "trigger" && selectedArea) {
                            selectedArea.trigger = { name: '', service: '', parameters: [{ name: '', input: '' }] };
                            localStorage.removeItem('selectedIngredients');
                        }
                        if (mode.type === "actions" && selectedArea)
                            selectedArea.actions[selectedArea.actions.length - 1] = { name: '', service: '', parameters: [{ name: '', input: '' }] };
                        setMode(undefined);
                    } else {
                        setCurrentPage("services")
                    }
                }}>
                    Back
                </button>
            </div>
            <div className='thin-line' style={{ backgroundColor: 'white', opacity: 0.5 }}></div>
            <div className='service-infos' style={{ backgroundColor: services.color }}>
                <div className='service-txt' style={{ color: 'white' }}>
                    {selectedArea?.trigger?.name?.length === 0 ? "Choose a trigger" : mode ? "Choose parameters" : "Choose an action"}
                </div>
                <div className="service-actions-presentation-holder">
                    <div className="service-logo-holder">
                        <img
                            alt="logo"
                            className="service-logo"
                            src={services.name !== 'none' ? require(`../../../../../public/servicesLogo/${services.name}.png`) : ''}
                        />
                    </div>
                    <div className="service-description">
                        <div>{uppername}</div>
                    </div>
                </div>
            </div>
            {mode && mode.infos.parameters.length > 0 ? (
                <div className='action-parameters'>
                    <form onSubmit={(e) => { e.preventDefault(); submitParams(); }}>
                        <div className='action-parameters-name'>{getBetterNames(mode.infos.name)}</div>
                        {selectedArea && mode.infos.parameters.map((item, index) => (
                            <div key={index}>
                                <Input
                                    onChange={(e) => { handleInputChange(index, e.target.value, item.name) }}
                                    placeholder={item.input}
                                    type='searchInput'
                                    value={parametersInput[index]}
                                    required={!item.optional}
                                />
                                {mode.type === "actions" && ingredients.length > 0 ?
                                    <select className='ingredient-pick' defaultValue={"Ingredients"} onChange={(e) => handleIngredientChange(e.target.value, index, item.name)}>
                                        <option value={"Ingredients"}>{"Ingredients"}</option>
                                        {ingredients.map((ingredient, i) => (
                                            <option key={i} value={ingredient.name}>{ingredient.description}</option>
                                        ))}
                                    </select>
                                    : ''}
                            </div>
                        ))}

                        <div style={{ paddingBottom: "15%" }}>
                            <button type="submit" className='add-action-btn' style={{ marginLeft: 0, height: '3.5rem', border: '1px solid' }}>
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            ) :
                <div className="services-actions-holder">
                    {selectedArea && (selectedArea?.trigger?.name?.length > 0 ? (
                        services.actions.map((item, index) => (
                            <ServiceAction setMode={setMode} key={index} selectedArea={selectedArea} color={services.color} actionInfos={item} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                        ))
                    ) : (
                        services.triggers.map((item, index) => (
                            <ServiceAction setMode={setMode} key={index} selectedArea={selectedArea} color={services.color} actionInfos={item} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                        ))
                    ))}
                </div>
            }
        </>
    );
}

export default ServiceActions