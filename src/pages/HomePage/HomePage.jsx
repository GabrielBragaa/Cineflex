import { useEffect } from "react"
import { PageContainer, ListContainer, MovieContainer } from "./HomePageStyles";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
    
    let [filmes, setFilmes] = useState([]);

    useEffect(() => {
        const promise = axios.get(`https://mock-api.driven.com.br/api/v8/cineflex/movies`);
        promise.then(filme => setFilmes(filme.data));
        promise.catch(console.log('O servidor está passando por um problema. Tente novamente mais tarde.'))
    }, [])
    console.log('Filme data: ', filmes)
    return (
        <PageContainer>
            Selecione o filme
            <ListContainer>
                {filmes.map(filme => 
                <Link to={`/sessoes/${filme.id}`} key={filme.id}>
                    <MovieContainer key={filme.id} data-test="movie">
                        <img src={filme.posterURL} alt='poster' />
                    </MovieContainer>
                </Link>)}
            </ListContainer>

        </PageContainer>
    )
}

