import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import api from '../../services/api';
import {LeafletMouseEvent} from 'leaflet'

import {Map, TileLayer, Marker} from 'react-leaflet';
import { FiArrowLeft } from 'react-icons/fi';
import './styles.css';
import Logo from '../../assets/logo.svg';

// array ou objeto no estado: manualmente informar  o tipo da variavel

interface Item{
    id: number;
    title: string;
    image_url: string;
};

interface IBGEUFResponse{
    sigla: string;
};

interface IBGECityResponse{
    nome: string;
}

const CreatePoint=()=>{
    const [inputData, setInputData]=useState({
        name: '',
        email:'',
        whatsapp:'', 
    });
    const[items, setItems] = useState<Item[]>([]);
    const [selectedItems, setSelectedItems]= useState<number[]>([])

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [inicialPosition, setInicialPosition] = useState<[number, number]>([0, 0]);

    const handleSelectUf=(e:ChangeEvent<HTMLSelectElement>)=>{
        setSelectedUf(e.target.value);
    };
    const handleSelectCity=(e:ChangeEvent<HTMLSelectElement>)=>{
        setSelectedCity(e.target.value);
    };
    const handleMapClick=(e: LeafletMouseEvent)=>{
        setSelectedPosition([
            e.latlng.lat,
            e.latlng.lng
        ]);
    };

    const handleInputChange=(e: ChangeEvent<HTMLInputElement>)=>{
        const {name, value} = e.target;

        setInputData({ ...inputData, [name]:value });
    };

    const handleSelectItem=(id:number)=>{
        const alredySelected = selectedItems.findIndex(item=>item===id)

        if(alredySelected >=0){
            const filteredItems = selectedItems.filter(item=>item !== id);

            setSelectedItems(filteredItems);
        }else{
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleSubmit= async (e: FormEvent)=>{
        e.preventDefault();

        const {name, email, whatsapp} = inputData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = {
            name, 
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        };

        try{
            await api.post('points', data)
            window.alert('Ponto de coleta registrado com sucesso!')
        }catch(e){
            window.alert('Registro não efetuado! Algo deu errado. :(')
        }
        
    };

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(position=>{
            const { latitude, longitude} = position.coords;

            setInicialPosition([latitude, longitude]);
        });
    },[])

    useEffect(()=>{
        api.get('items').then(response=>{
            setItems(response.data);
        });
    },[])

    useEffect(()=>{
        axios.
        get<IBGEUFResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`)
        .then(response =>{
            const ufInitials = response.data.map(uf=>uf.sigla);

            setUfs(ufInitials)
        });
    },[]);

    useEffect(()=>{
        if(selectedUf==='0'){
            return;
        }

        axios
        .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response=>{
            const cityNames = response.data.map(city=> city.nome);

            setCities(cityNames)
        });
    },[selectedUf])

    return(
        <div id="page-create-point">
            <header>
                <img src={Logo} alt={'Ecoleta icon'}/>

                <Link to='/'>
                    <FiArrowLeft/>
                    Voltar para Home
                </Link>
            </header> 

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor='name'>Nome da entidade</label>
                        <input
                        onChange={handleInputChange} 
                        type='text'
                        id='name'
                        name='name'
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor='email'>Email</label>
                            <input
                            onChange={handleInputChange}  
                            type='email'
                            id='email'
                            name='email'
                            />
                        </div>
                        <div className="field">
                            <label htmlFor='name'>Whatsapp</label>
                            <input
                            onChange={handleInputChange}  
                            type='text'
                            id='whatsapp'
                            name='whatsapp'
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                    
                    <Map center={inicialPosition} zoom={15} onClick={handleMapClick }>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker
                            position={selectedPosition}
                        />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor='uf'>Estado (UF)</label>
                            <select 
                            onChange={handleSelectUf} 
                            value={selectedUf} 
                            name='uf' id='uf'
                            >
                                <option value='0'>Selecione uma UF</option>
                                {ufs.map(uf=>{
                                    return <option key={uf} value={uf}>{uf}</option>
                                })}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor='city'>Cidade</label>
                            <select 
                            onChange={handleSelectCity}
                            value={selectedCity}
                            name='city' id='city'>
                                <option value='0'>Selecione uma cidade</option>
                                {cities.map(city=>{
                                    return <option key={city} value={city}>{city}</option>
                                })}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item=>(
                            <li 
                            key={item.id} 
                            onClick={()=>handleSelectItem(item.id)}
                            className={selectedItems.includes(item.id)?'selected':''}
                            >
                            <img src={item.image_url} alt={item.title}/>
                            <span>{item.title}</span>
                        </li>
                        ))} 
                    </ul> 
                </fieldset>

                <button type='submit'>
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    )
};

export default CreatePoint