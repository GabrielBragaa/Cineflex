import { PageContainer, TextContainer } from "./SuccessPageStyled";
import { useNavigate, useLocation } from "react-router-dom";


export default function SuccessPage() {

    const navigate = useNavigate();
    const location = useLocation().state;
    const {name, cpf, title, hour, date, seatOK} = location;
    return (
        <PageContainer>
            <h1>Pedido feito <br /> com sucesso!</h1>

            <TextContainer data-test="movie-info">
                <strong><p>Filme e sessão</p></strong>
                <p>{title}</p>
                <p>{date} - {hour}</p>
            </TextContainer>

            <TextContainer data-test="seats-info">
                <strong><p>Ingressos</p></strong>
                {seatOK.map(assento => <p key={assento.id} >Assento {assento}</p>)}
            </TextContainer>

            <TextContainer data-test="client-info">
                <strong><p>Comprador</p></strong>
                <p>Nome: {name}</p>
                <p>CPF: {cpf}</p>
            </TextContainer>

            <button onClick={() => navigate('/')} data-test="go-home-btn">Voltar para Home</button>
        </PageContainer>
    )
}