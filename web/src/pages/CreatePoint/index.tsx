import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';

import axios from 'axios';
import api from '../../services/api';

import './styles.css';

import Logo from '../../assets/logo.svg';

interface Item {
    id: number;
    title: string;
    imageUrl: string;
}

interface IBGEUFresponse {
    sigla: string;
}

const CreatePoint: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);

    useEffect(() => {
        api.get('itens').then(response => {
            console.log(response);;
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

    return (
        <div id="page-create-point">
            <header>
                <img src={Logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para a Home
                </Link>
            </header>

            <form action="">
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
                            name="name" />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">email</label>
                            <input
                                type="email"
                                id="email"
                                name="email" />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">whatsapp</label>
                            <input
                                type="text"
                                id="whatsapp"
                                name="whatsapp" />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={[-22.6752336, 47.7545854]} zoom={15}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={[-22.6752336, 47.7545854]} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select name="uf" id="uf">
                                <option value="0">Selecione UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="City">Cidade</label>
                            <select name="City" id="City">
                                <option value="0">Selecione Cidade</option>
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
                            <li key={item.id}>
                                <img src={item.imageUrl} alt={item.title} />
                                <span>{item.title}</span>
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