import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

export default function SeatsPage() {

    const params = useParams();
    const navigate = useNavigate();
    let [seats, setSeats] = useState([]);
    let [filme, setFilme] = useState([]);
    let [ids, setIds] = useState([]);
    let [seatOK, setSeatOK] = useState([]);
    let [name, setName] = useState('');
    let [cpf, setCPF] = useState('');

    useEffect(() => {
        const promise = axios.get(`https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${params.idSessao}/seats`);
        promise.then((s) => { 
            setSeats(s.data.seats)
            setFilme(s.data) 
        });
    }, []) 
    if(filme.length === 0) {
        return (
            <div style={{ marginTop: "80px", fontSize: "30px" }}>
                <p>Carregando Assentos...</p>
            </div>
        )
    } 

    function getSeat(id, isAvailable, name) {
        
        if(!ids.includes(id) && isAvailable){
            setIds([...ids, id]);
            setSeatOK([...seatOK, name])
        } else if(ids.includes(id)){
            setIds(ids.filter(i => {
                if(i === id) return false
                else return true
            }))
        } else if(!isAvailable){
            alert("Esse assento não está disponível")

        }

    }
    
    function buyTicket(e) {
        e.preventDefault();

        const objSuccess = { seatOK, name, cpf: cpf, title:filme.movie.title, hour: filme.name, date: filme.day.date };
        const infoBuyer = {ids, name, cpf};
        const promise = axios.post('https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many', infoBuyer);
        promise.then(response => navigate('/sucesso', {state: objSuccess}));
    }

    return (
        <PageContainer>
            Selecione o(s) assento(s)

            <SeatsContainer>
                {seats.map(assentos => <SeatItem isAvailable={assentos.isAvailable} key={assentos.id} 
                 ids={ids} id={assentos.id} onClick={() => getSeat(assentos.id, assentos.isAvailable, assentos.name)} data-test="seat">{assentos.name}</SeatItem>) }
            </SeatsContainer>

            <CaptionContainer>
                <CaptionItem>
                    <CaptionCircle style={{backgroundColor:'#1AAE9E', border:'1px solid #0E7D71'}}/>
                    Selecionado
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle style={{backgroundColor:'#C3CFD9', border:'1px solid #7B8B99'}}/>
                    Disponível
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle style={{backgroundColor:'#FBE192', border:'1px solid #F7C52B'}}/>
                    Indisponível
                </CaptionItem>
            </CaptionContainer>

            <FormContainer onSubmit={buyTicket}>
                <label htmlFor="nome">Nome do Comprador:</label>
                <input data-test="client-name" placeholder="Digite seu nome..." id='nome' required value={name} onChange={(e) => setName(e.target.value)} />

                <label htmlFor="cpf">CPF do Comprador:</label>
                <input data-test="client-cpf" placeholder="Digite seu CPF..." id="cpf" required value={cpf} onChange={(e) => setCPF(e.target.value)} />

                <button type="submits" data-test="book-seat-btn">Reservar Assento(s)</button>
            </FormContainer>

            <FooterContainer data-test="footer">
                <div>
                    <img src={filme.movie.posterURL} alt="poster" />
                </div>
                <div>
                    <p>{filme.movie.title}</p>
                    <p>{filme.day.weekday} - {filme.name}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
`

const SeatItem = styled.div`
    border: 1px solid ${props => !props.isAvailable ? '#F7C52B' : (!props.ids.includes(props.id)) ? '#7B8B99' : '#0E7D71'};
    background-color: ${props => !props.isAvailable ? '#FBE192' : (!props.ids.includes(props.id)) ? '#C3CFD9' : '#1AAE9E'};   // Essa cor deve mudar
    height: 25px;
    width: 25px;
    border-radius: 25px;
    font-family: 'Roboto';
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`

const SeatsContainer = styled.div`
    width: 330px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`

const FormContainer = styled.form`
    width: calc(100vw - 40px); 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
    font-size: 18px;
    button {
        align-self: center;
    }
    input {
        width: calc(100vw - 60px);
    }
`
const CaptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 300px;
    justify-content: space-between;
    margin: 20px;
`
const CaptionCircle = styled.div`
    border: 1px solid blue;         // Essa cor deve mudar
    background-color: lightblue;    // Essa cor deve mudar
    height: 25px;
    width: 25px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const CaptionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
`

const FooterContainer = styled.div`
    width: 100%;
    height: 120px;
    background-color: #C3CFD9;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    position: fixed;
    bottom: 0;

    div:nth-child(1) {
        box-shadow: 0px 2px 4px 2px #0000001A;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        margin: 12px;
        img {
            width: 50px;
            height: 70px;
            padding: 8px;
        }
    }

    div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            text-align: left;
            &:nth-child(2) {
                margin-top: 10px;
            }
        }
    }
`