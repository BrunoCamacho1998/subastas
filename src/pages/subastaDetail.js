import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate, useParams } from "react-router-dom";
import { crearSubasta, finalizar, guardarSubasta, obtenerSubastas } from "../services/subasta";

const SubastaDetail = () => {
    
    const navigate = useNavigate()
    const { subastaID, ofertaMinima } = useParams()
    const destinationWallet = "HUNrdWSzeBSNYiu4Js4dhn5cMpXKNQgTzoRFDCQ8PPpG";

    let timeInterval;
    const [auction, setAuction] = useState(null)
    const [minBid, setMinBid] = useState('')
    const [bidderNamesList, setBidderNamesList] = useState([])

    const [auctionScreen, setAuctionScreen] = useState('none')
    const [timerElement, setTimerElement] = useState('10:00');
    const [currentBidValueElement, setCurrentBidValueElement] = useState('0')

    const [showModal, setShowModal] = useState(false)
    
    const [winnerName, setWinnerName] = useState('')
    const [winnerAmount, setWinnerAmount] = useState('')
    
    const [countdownElement, setCountdownElement] = useState('03:00')

    const [showWhatsappModal, setShowWhatsappModal] = useState(false)

    const fullname = sessionStorage.getItem("fullname")

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        if (auction) {
            updateBiddersList(auction)
            startAuctionTimer();
        }
    }, [auction])

    const getData = async () => {
        const subastaDatos = await crearSubasta(subastaID);
        const bidderList = await obtenerSubastas(subastaID)
        const time = obtenerMinutosRestantes(subastaDatos.inicio)

        const _bidderArray = {}

        for(let bidder of bidderList) {
            _bidderArray[bidder.nombre] = (_bidderArray[bidder.nombre] ?? 0) + bidder.cantidad
        }

        const { nombre, cantidad } = obtenerMayor(_bidderArray)

        const _auction = {
            currentBid: cantidad === 0 ? ofertaMinima : cantidad,
            highestBidder: nombre === '' ? null : nombre,
            bidders: _bidderArray,
            remainingTime: time
        }
        setAuction(_auction)

        setMinBid(ofertaMinima);

        setCurrentBidValueElement(_auction.currentBid);
    }

    

    const updateBiddersList = (auction) => {
        let _bidderList = []
        for (const [key, value] of Object.entries(auction.bidders)) {
            _bidderList.push({ key, value })
        }

        setBidderNamesList(_bidderList)
    }
    

    const obtenerMinutosRestantes = (inicio) => {
        
        const currentDate = new Date()
        const subastaDate = new Date(inicio)

        const diferenciaMilisegundos = currentDate - subastaDate;

        const diferenciaSegundos = Math.floor(diferenciaMilisegundos / 1000);

        return 600 - diferenciaSegundos;
    }

    const offerTokens = async (tokens) => {
        const _auction = auction
        if (_auction && fullname) {
            // const newBid = parseInt(_auction.currentBid) + tokens;
            if (!_auction.bidders[fullname]) {
                _auction.bidders[fullname] = 0;
            }
            _auction.bidders[fullname] += tokens;
            
            const { nombre, cantidad } = obtenerMayor(_auction.bidders)
            _auction.currentBid = cantidad;
            _auction.highestBidder = nombre;

            setCurrentBidValueElement(cantidad);
            setAuction(_auction)
            await agregarSubasta(subastaID, fullname, tokens);

            updateBiddersList(_auction);

            alert(`Has ofertado ${tokens} CumbiaCoin (GAAAAAA) tokens. La oferta actual es ${_auction.currentBid} tokens.`);
        } else {
            alert("La subasta no está activa o no has iniciado sesión.");
        }
    }

    

    const agregarSubasta = async (subastaID, nombre, cantidad) => {
        await guardarSubasta(subastaID, nombre, cantidad)
    }

    const startAuctionTimer = async () => {

        if (!auction) return;

        timeInterval = setInterval(async () => {
            if (auction.remainingTime > 0) {
                auction.remainingTime--;

                // Calcula los minutos y segundos restantes
                const minutes = Math.floor(auction.remainingTime / 60);
                const seconds = auction.remainingTime % 60;

                // Formatea los segundos para que siempre tengan 2 dígitos
                const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

                setTimerElement(`${minutes}:${formattedSeconds}`);
            } else {
                await finalizar(subastaID);
                
                clearInterval(timeInterval);
                alert(`¡La subasta ha terminado! El ganador es ${auction.highestBidder} con una oferta de ${auction.currentBid} CumbiaCoin (GAAAAAA) tokens.`);
                setBidderNamesList([])
                showWinnerModal(auction.highestBidder, auction.currentBid);
                
            }
        }, 1000);
    }

    

    const regresar = () => {
        setAuctionScreen("none");
        setBidderNamesList([])
        navigate("/subastas/subastas")
    }
    

    const closeModal = () => {
        setShowModal(false)
        regresar();
    }
    
    

    const showWinnerModal = (winnerName, winnerAmount) => {
        setWinnerName(`Ganador: ${winnerName}`)
        setWinnerAmount(`Tokens Ofertados: ${winnerAmount}`);
        let countdownTime = 3 * 60;
        const countdownInterval = setInterval(() => {
            if (countdownTime > 0) {
                countdownTime--;
                const minutes = Math.floor(countdownTime / 60);
                const seconds = countdownTime % 60;
                setCountdownElement(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
            } else {
                clearInterval(countdownInterval);
                showWhatsAppModal();
            }
        }, 1000);

        setShowModal(true)
    }

    

    const showWhatsAppModal = () => {
        setShowWhatsappModal(true)
    }

    const closeWhatsAppModal = () => {
        setShowWhatsappModal(false)
        window.location.reload();
    }

    const obtenerMayor = (bidders) => {
        let maxNombre = "";
        let maxCantidad = 0;

        for (const [key, value] of Object.entries(bidders)) {
            if (value > maxCantidad) {
                maxNombre = key;
                maxCantidad = value;
            }
        }

        return { nombre: maxNombre, cantidad: maxCantidad }
    }

    return (
        <div className="app">
            <header>
                <h1>Subasta de Mesas VIP - Discoteca NAUTICA</h1>
            </header>
            <div className="app-container">
                <div className="container">
                    <div className="auction-screen" id="auctionScreen" style={{ display: 'block' }}>
                    <h1>Subasta Activa - Discoteca NAUTICA</h1>
                    <div className="auction-info">
                        <h2>Espacio en Subasta: <span>{subastaID}</span></h2>
                        <h3>Oferta Mínima: <span>{minBid}</span> CumbiaCoin (GAAAAAA) Tokens</h3>
                        <div id="timer">Tiempo restante: <span id="timeLeft">{timerElement}</span></div>
                        {
                            bidderNamesList.length > 0 && 
                            <div className="current-bid">Oferta más alta: <span>{currentBidValueElement}</span> CumbiaCoin (GAAAAAA) Tokens</div>
                        }

                        <div className="offer-buttons">
                            <button onClick={() => offerTokens(1)}>Ofertar 1 Token</button>
                            <button onClick={() => offerTokens(2)}>Ofertar 2 Tokens</button>
                        </div>

                        <div id="biddersList">
                            <h3>Personas participando en la subasta:</h3>
                            <ul>
                                {
                                    bidderNamesList.map((bidderName) => {
                                        return (
                                            <li key={bidderName + 'key'}>
                                                { `${bidderName.key} ha ofertado un total de ${bidderName.value} CumbiaCoin (GAAAAAA) tokens` }
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>

                        <button className="back-button" onClick={regresar}>Regresar a ver más subastas</button>
                    </div>
                </div>
                </div>
            </div>
            
            
            <footer>
                <p>Discoteca Nautica - Subasta en Vivo | Solana Blockchain</p>
            </footer>

            
            { 
                showModal &&
                <div className="modal">
                    <div className="modal-content">
                        <h2>¡Ganador de la Subasta!</h2>
                        <p>{winnerName}</p>
                        <p>{winnerAmount}</p>
                        <p>Dirección para la transferencia: <strong>HUNrdWSzeBSNYiu4Js4dhn5cMpXKNQgTzoRFDCQ8PPpG</strong></p>
                        <QRCode value={destinationWallet}></QRCode>
                        <div className="countdown">Tiempo restante para transferir: <span id="countdownTimer">{countdownElement}</span></div>
                        <button onClick={closeModal}>Cerrar</button>
                    </div>
                </div>
            }            

            {
                showWhatsappModal && 
                <div className="whatsapp-modal">
                    <h2>Envía la captura de los tokens enviados</h2>
                    <p>Por favor, envía la captura de los tokens enviados al número de WhatsApp: <strong>+51 979 462 198</strong> para corroborar si se hizo el pago correctamente.</p>
                    <button onClick={closeWhatsAppModal}>Cerrar y Reiniciar</button>
                </div>
            }

        </div>
    )
}

export default SubastaDetail