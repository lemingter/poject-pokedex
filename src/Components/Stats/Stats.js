import React, { useState, useEffect } from 'react';
import './Stats.css';

function Stats({pokemon}) {
    const [pokeData, setPokeData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/`);
            const result = await data.json();

            setPokeData(result);
        }

        fetchData();
    }, [pokemon])

    return (
        <div className="StatsContainer">
            <div className="spicie">
                <p><strong>Spicies: </strong>{pokeData.name}</p>
            </div>
            <div className="types">
                <p><strong>Types:</strong></p>
                <p>Main: {pokeData.types[0].type.name}</p>
                {
                    pokeData.types[1] && <p>Secondary: {pokeData.types[1].type.name}</p>
                }
            </div>
            <div className="abilities">
                <p><strong>Abilities:</strong></p>
                <p>Main: {pokeData.abilities[0].ability.name}</p>
                {
                    pokeData.abilities[1] && <p>Secondary: {pokeData.abilities[1].ability.name}</p>
                }
            </div>
            <div className="stats">
                <p><strong>Statistics:</strong></p>
                <p>HP: {pokeData.stats[0].base_stat}</p>
                <p>Attack: {pokeData.stats[1].base_stat}</p>
                <p>Defense: {pokeData.stats[2].base_stat}</p>
                <p>Special Attack: {pokeData.stats[3].base_stat}</p>
                <p>Special Defense: {pokeData.stats[4].base_stat}</p>
            <p>Speed: {pokeData.stats[5].base_stat}</p>
            </div>
        </div>
    );
}

export default Stats;