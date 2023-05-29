import { useParams } from "react-router-dom"
import { PageContainer, SessionContainer, ButtonsContainer, FooterContainer } from "./SessionsPageStyle";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function SessionsPage() {

    let [sessao, setSessao] = useState([]);
    const params = useParams();

    useEffect(() => {
            const promise = axios.get(`https://mock-api.driven.com.br/api/v8/cineflex/movies/${params.idFilme}/showtimes`)
            promise.then(info => setSessao(info.data))
            promise.catch(erro => console.log(erro.response.data))}
            , []);
    

    if(sessao.length === 0) {
        return (
            <div style={{ marginTop: "80px", fontSize: "30px" }}>
                <p>Carregando Sessões...</p>
            </div>
        )
    } 
            
    return (
        <PageContainer>
            Selecione o horário
            <div>
                {sessao.days.map((dia) => (
                    <SessionContainer key={dia.id} data-test="movie-day">
                    {dia.weekday} - {dia.date}
                        <ButtonsContainer>
                                {dia.showtimes.map((showtime) => (
                                    <Link to={`/assentos/${showtime.id}`} key={showtime.id} data-test="showtime">
                                        <button>{showtime.name}</button>
                                    </Link>
                                ))}
                        </ButtonsContainer>
                    </SessionContainer>
                ))}
            </div>

            <FooterContainer data-test="footer">
                <div>
                    <img src={sessao.posterURL} alt="poster" />
                </div>
                <div>
                    <p>{sessao.title}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}