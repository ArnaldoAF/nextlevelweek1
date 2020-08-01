import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';

import axios from 'axios';
import api from '../../services/api';
import { LeafletMouseEvent } from 'leaflet';

import './styles.css';

import Logo from '../../assets/logo.svg';

interface Item {
    id: number;
    title: string;
    imageUrl: string;
    selected: boolean;
}

interface IBGEUFresponse {
    sigla: string;
}


interface IBGECityresponse {
    nome: string;
}

const CreatePoint: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        whatsapp: ''
    });

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number,number]>([0,0]);

    const [initialPosition, setInitialPosition] = useState<[number,number]>([0,0]);

    useEffect(() => {
        api.get('itens').then(response => {
            console.log(response);
            setItems(response.data);
        })
    },[]);

    useEffect(() => {
        axios.get<IBGEUFresponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(x => x.sigla);
            console.log(ufInitials);
            setUfs(ufInitials);
        })
    },[]);

    useEffect(() => {
        const currentPosition = navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            
            setInitialPosition([latitude, longitude]);
            console.log([latitude, longitude]);
            console.log(initialPosition,"initialPosition");
            console.log(selectedPosition,"selectedPosition");
        });
        

    },[])

    useEffect(() => {
        if (selectedUf == '0') return;

        axios.get<IBGECityresponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const citiesResponse = response.data.map(x => x.nome);
            console.log(citiesResponse);
            setCities(citiesResponse);
        })

    }, [selectedUf]);

    function handleSelectedUF(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setSelectedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        console.log(event.latlng);
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        console.log(event.target.name, event.target.value);
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        })
    }

    function handleSelectedItem(id: number) {
        let localList = items.map(x => x);
        console.log(localList);
        localList[id-1].selected = !localList[id-1].selected;
        setItems(localList);
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
    
        const { nome, email, whatsapp} = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const itemsList = items.filter(item => item.selected).map(item => item.id);

        const data ={
            name:nome,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            itens:itemsList
        };

        await api.post('points', data);

        console.log(data);
        alert('sucess');
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={Logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para a Home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            onChange={handleInputChange} />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                onChange={handleInputChange} />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">whatsapp</label>
                            <input
                                type="text"
                                id="whatsapp"
                                name="whatsapp"
                                onChange={handleInputChange} />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition[0] == 0 && selectedPosition[1] == 0 ? initialPosition : selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select name="uf" id="uf" onChange={handleSelectedUF}>
                                <option value="0">Selecione UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="City">Cidade</label>
                            <select name="City" id="City" onChange={handleSelectedCity}>
                                <option value="0">Selecione Cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>ítens de coleta</h2>
                        <span>Selecione um ou mais intens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id} 
                                onClick={() => handleSelectedItem(item.id)}
                                className={item.selected ? "selected" : "none"}>
                                <img src={item.imageUrl} alt={item.title} />
                                <span>{item.title}</span>
                                <span>{item.selected}</span>
                            </li>
                        ))}


                    </ul>
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    )
}

export default CreatePoint;