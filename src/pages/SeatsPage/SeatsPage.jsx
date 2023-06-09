import { useNavigate, useParams } from "react-router-dom"
import { PageContainer, SeatItem, SeatsContainer, FormContainer, CaptionContainer, CaptionCircle, CaptionItem, FooterContainer } from "./SeatsPageStyles";
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
        promise.catch(erro => console.log(erro.response.data))
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

        const objSuccess = { seatOK, name, cpf: formateCPF(cpf), title:filme.movie.title, hour: filme.name, date: filme.day.date };
        const infoBuyer = {ids, name, cpf};
        const promise = axios.post('https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many', infoBuyer);
        promise.then(response => navigate('/sucesso', {state: objSuccess}));
        promise.catch(console.log('Falha ao comprar ingresso. Tente novamente.'))
    }

    function formateCPF(cpf){
        cpf = cpf.replace(/\D/g, '');

        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{2})$/, '$1-$2');

        return cpf;
    }

    if(filme.length === 0) {
        return (
            <div style={{ marginTop: "80px", fontSize: "30px" }}>
                <p>Carregando Sessões...</p>
            </div>
        )
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

