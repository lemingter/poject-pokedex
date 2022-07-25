import React, { useState, useEffect } from 'react';
import Stats from '../Stats/Stats';
import './Pokedex.css';

function Pokedex(props) {
    const [pokemons, setPokemons] = useState([]);
    const [types, setTypes] = useState([]);
    const [generations, setGenerations] = useState([]);

    const [currentPageUrl, setCurrentPageUrl] = useState("https://pokeapi.co/api/v2/pokemon-species/?offset=0&limit=20");
    const [currentPokemon, setCurrentPokemon] = useState(0);
    const [currentGeneration, setCurrentGeneration] = useState(0);
    const [currentType, setCurrentType] = useState(0);
    const [numPages, setNumPages] = useState(0);
    const [pokemonLimit, setPokemonLimit] = useState(20);
    const [page, setPage] = useState(0); 

    useEffect(() => {
        const type = currentType;
        const generation = currentGeneration;
        let url;
        if(type === 0 && generation === 0) {
            url = currentPageUrl;
        }
        else {
            generation !== 0 ? 
            url = `https://pokeapi.co/api/v2/generation/${generation}/`
            :
            url = `https://pokeapi.co/api/v2/type/${type}/`;
        }

        async function fetchPokemons() {
            if(type === 0 && generation === 0) {
                const data = await fetch(url);
                const { count, results } = await data.json();

                setPokemons(results);
                setNumPages(Math.round(count / 20));
            } 
            else {
                if(generation !== 0){
                    const data = await fetch(url);
                    const { pokemon_species } = await data.json();

                    setPokemons(pokemon_species);
                    setPokemonLimit(pokemon_species.length);
                }
                else {
                    const data = await fetch(url);
                    const { pokemon } = await data.json();

                    setPokemons(pokemon);
                    setPokemonLimit(pokemon.length);
                }
            }
        }

        async function fetchTypes() {
            const data = await fetch("https://pokeapi.co/api/v2/type/");
            const { results } = await data.json();

            setTypes(results);
        }

        async function fetchGenerations() {
            const data = await fetch("https://pokeapi.co/api/v2/generation/");
            const { results } = await data.json();

            setGenerations(results);
        }

        fetchGenerations();
        fetchTypes();
        fetchPokemons();
    }, [currentPageUrl, currentType, currentGeneration]);

    const changePage = (num, pos) => {
        setCurrentPageUrl(`https://pokeapi.co/api/v2/pokemon-species/?offset=${num * 20}&limit=20`);
        setPage(num);
        setCurrentPokemon(pos);
    }

    const nextPokemon = () => {
        if(currentPokemon + 1 < pokemonLimit){
            setCurrentPokemon(currentPokemon + 1);
        }
        else {
            if(page + 1 <= numPages)
                changePage(page + 1, 0);
        }
    }

    const prevPokemon = () => {
        if(currentPokemon - 1 >= 0){
            setCurrentPokemon(currentPokemon - 1); 
        }
        else {
            if(page - 1 >= 0)
                changePage(page - 1, 19);
        }
        
    }

    const handleOnChange = e => {
        const {target:{value, name}} = e;

        if(name === 'gen') {
            if (value === "none") {
                setCurrentGeneration(0);
            }
            else {
                setCurrentGeneration(value);
            }
        }
        else {
            if (value === "none") {
                setCurrentType(0);
            }
            else {
                setCurrentType(value);
            }
        }

        setCurrentPokemon(0);
    }

    return (
        <div className="Pokedex">
            <div className="PokedexContainer">
                <h1 className="title">Pokedex</h1>
                <div className="name">
                    {
                        currentType === 0 ? 
                        pokemons.map((pokemon, i) => (
                            i === currentPokemon && <p key={i}>{pokemon.name}</p>
                        ))
                        :
                        pokemons.map((pokemon, i) => (
                            i === currentPokemon && <p key={i}>{pokemon.pokemon.name}</p>
                        ))
                    }
                </div>
                <div className="sprite">
                    <img 
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                            currentGeneration === 0 ?
                            (currentPokemon + (page * 20)) + 1
                            :
                            pokemons[currentPokemon].url.split('/')[6]
                        }.png`} 
                        alt="Sprite" width="150" height="150"/>
                </div>
                <div className="arrows">
                    <button onClick={prevPokemon}><i class="fa fa-arrow-left fa-4x" aria-hidden="true"></i></button>
                    <button onClick={nextPokemon}><i class="fa fa-arrow-right fa-4x" aria-hidden="true"></i></button>
                </div>
                <div>
                    <select name="type" onChange={handleOnChange}>
                        <option value="none" select="true">--Type--</option>
                        {
                            types.map((type, i) => (
                                <option value={i + 1} key={i}>{type.name}</option>
                            ))
                        }
                    </select>
                    <select name="gen" onChange={handleOnChange}>
                        <option value="none" select="true">--Generation--</option>
                        {
                            generations.map((type, i) => (
                                <option value={i + 1} key={i}>Generation {i + 1}</option>
                            ))
                        }
                    </select>
                </div>
            </div>

            <div className="Stats">
                <h1 className="tite">Stats</h1>
                <Stats pokemon={
                    currentGeneration === 0 ?
                    (currentPokemon + (page * 20)) + 1
                    :
                    pokemons[currentPokemon].url.split('/')[6]} 
                    />
            </div>

        </div>
    );
}

export default Pokedex;