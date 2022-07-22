import React, { useState, useEffect } from 'react';
import './Pokedex.css';

function Pokedex(props) {
    const [pokemons, setPokemons] = useState([]);
    const [types, setTypes] = useState([]);

    const [currentPageUrl, setCurrentPageUrl] = useState("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20");
    const [currentPokemon, setCurrentPokemon] = useState(0);
    const [currentType, setCurrentType] = useState(0);
    const [numPages, setNumPages] = useState();
    const [page, setPage] = useState(0); 

    useEffect(() => {
        const type = currentType;
        let url;
        if(type === 0) {
            url = currentPageUrl;
        }
        else {
            url = `https://pokeapi.co/api/v2/type/${type}/`;
        }

        async function fetchPokemons() {
            if(type === 0) {
                const data = await fetch(url);
                const { count, results } = await data.json();

                setPokemons(results);
                setNumPages(Math.round(count / 20));
            } 
            else {
                const data = await fetch(url);
                const { pokemon } = await data.json();

                setPokemons(pokemon);
                setNumPages(pokemon.length);
            }
        }

        async function fetchTypes() {
            const data = await fetch("https://pokeapi.co/api/v2/type/");
            const { results } = await data.json();

            setTypes(results);
        }

        fetchTypes();
        fetchPokemons();
    }, [currentPageUrl, currentType]);

    const changePage = (num, pos) => {
        setCurrentPageUrl(`https://pokeapi.co/api/v2/pokemon/?offset=${num * 20}&limit=20`);
        setPage(num);
        setCurrentPokemon(pos);
    }

    const nextPokemon = () => {
        if(currentPokemon + 1 < 20){
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
        const {target:{value}} = e;

        if (value === "none") {
            setCurrentType(0);
        }
        else {
            setCurrentType(value);
        }
    }

    return (
        <div className="Pokedex">
            <h1>Pokedex</h1>
            <div>
                {console.log(pokemons)}
                {
                    currentType === 0 ? 
                    pokemons.map((pokemon, i) => (
                        i === currentPokemon && <h2 key={i}>{pokemon.name}</h2>
                    ))
                    :
                    pokemons.map((pokemon, i) => (
                        i === currentPokemon && <h2 key={i}>{pokemon.pokemon.name}</h2>
                    ))
                }
            </div>
            <div>
                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${(currentPokemon + (page * 20)) + 1}.png`} alt="Sprite" width="150" height="150"/>
            </div>
            <div>
                <button onClick={prevPokemon}>Prev</button>
                <button onClick={nextPokemon}>Next</button>
            </div>
            <div>
                <select onChange={handleOnChange}>
                    <option value="none" select>none</option>
                    {
                        types.map((type, i) => (
                            type.name !== "shadow" && type.name !== "unknown" && <option value={i + 1} key={i}>{type.name}</option>
                        ))
                    }
                </select>
            </div>
        </div>
    );
}

export default Pokedex;