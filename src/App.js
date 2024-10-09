import { useEffect, useState } from 'react';
import QRCode from "react-qr-code";
import './App.css';

import DiscoNautica from "./assets/images/disco_nautica.jpg";
import { crearSubasta, finalizar, guardarSubasta, obtenerSubastas } from './services/subasta';

function App() {

    const [showForm, setShowForm] = useState(true)
    const [showModal, setShowModal] = useState(false)

    const [phantomWallet, setPhantomWallet] = useState(null)

    const [auctionSpace, setAuctionSpace] = useState('')
    const [walletAddress, setWalletAddress] = useState('')
    const [minBid, setMinBid] = useState('')
    const [mainContentDisplay, setMainContentDisplay] = useState('none')
    const [fullname, setFullname] = useState('')
    
    const [currentAuction, setCurrentAuction] = useState(null);
    const [bidderNamesList, setBidderNamesList] = useState([])

    const [auctionData, setAuctionData] = useState({});
    const [auctionIntervals, setAuctionIntervals] = useState({});
    const destinationWallet = "HUNrdWSzeBSNYiu4Js4dhn5cMpXKNQgTzoRFDCQ8PPpG";
    // const tokenMintAddress = "14UGL6smKzWeaXuUnCs5G3P8AZLP3LvKfMkyXkNDCPuq";

    const [auctionScreen, setAuctionScreen] = useState('none')
    const [timerElement, setTimerElement] = useState('10:00');
    const [currentBidValueElement, setCurrentBidValueElement] = useState('0');

    // Modal
    const [winnerName, setWinnerName] = useState('')
    const [winnerAmount, setWinnerAmount] = useState('')
    
    const [countdownElement, setCountdownElement] = useState('03:00')
    const [showWhatsappModal, setShowWhatsappModal] = useState(false)

    useEffect(() => {
        if (!auctionIntervals[currentAuction] && !!currentAuction) {
            startAuctionTimer(currentAuction);
        }
    }, [currentAuction])


    const getProvider = () => {
        if ('phantom' in window) {
            const provider = window.phantom?.solana;

            if (provider?.isPhantom) {
                return provider;
            }
            else {
                return null
            }
        }
    };

    const connectWallet = async () =>{
        const provider = getProvider();
        if (provider) {
            provider.connect()
                .then(({ publicKey }) => {
                    setPhantomWallet(publicKey)
                    setWalletAddress(`Conectado: ${publicKey}`)
                    setShowForm(false)
                    setMainContentDisplay('flex')
                })
                .catch((err) => {
                    setWalletAddress('Error')
                    console.error("Error al conectar la wallet", err)
                })
        } else {
            window.location.href = "https://phantom.app/";
        }
    }

    const registerAucioneer = () => {
        if (fullname && phantomWallet) {
            alert(`Usuario registrado: ${fullname}`);
            setShowForm(false)
            setMainContentDisplay("flex")
        } else {
            alert("Por favor, ingresa tus nombres y apellidos y conecta tu wallet.");
        }
    }

    const offerTokens = async (tokens) => {
        if (currentAuction && auctionData[currentAuction] && fullname) {
            const auction = auctionData[currentAuction];
            const newBid = auction.currentBid + tokens;
            auction.currentBid = newBid;
            auction.highestBidder = fullname;

            if (!auction.bidders[fullname]) {
                auction.bidders[fullname] = 0;
            }
            auction.bidders[fullname] += tokens;

            setCurrentBidValueElement(auction.currentBid);
            await agregarSubasta(currentAuction, fullname, tokens);

            updateBiddersList(auction);

            alert(`Has ofertado ${tokens} CumbiaCoin (GAAAAAA) tokens. La oferta actual es ${auction.currentBid} tokens.`);
        } else {
            alert("La subasta no está activa o no has iniciado sesión.");
        }
    }

    const obtenerMinutosRestantes = (inicio) => {
        
        const currentDate = new Date()
        const subastaDate = new Date(inicio)

        const diferenciaMilisegundos = currentDate - subastaDate;

        const diferenciaSegundos = Math.floor(diferenciaMilisegundos / 1000);

        console.log({ diferenciaSegundos })

        return 600 - diferenciaSegundos;
    }

        const subastar = async (espacio, ofertaMinima) => {
            if (phantomWallet) {
                const subastaDatos = await crearSubasta(espacio);
                const bidderList = await obtenerSubasta(espacio)
                const time = obtenerMinutosRestantes(subastaDatos.inicio)

                const _bidderArray = {}

                for(let bidder of bidderList) {
                    _bidderArray[bidder.nombre] = bidder.cantidad
                }

                const auctionData_ = auctionData
                setCurrentAuction(espacio);

                if (!auctionData_[espacio]) {
                    auctionData_[espacio] = {
                        currentBid: ofertaMinima,
                        highestBidder: null,
                        bidders: _bidderArray,
                        remainingTime: time
                    };

                    setAuctionData(auctionData_)
                }

                const auction = auctionData_[espacio];
                // setBidderNamesList(bidderList)
                setAuctionSpace(espacio);
                setMinBid(ofertaMinima);
                setCurrentBidValueElement(auction.currentBid);
                updateBiddersList(auction);

                setMainContentDisplay("none");
                setAuctionScreen("block");
            } else {
                alert("Por favor, conéctate y regístrate primero.");
            }
        }

        const updateBiddersList = (auction) => {
            let _bidderList = []

            for (const [key, value] of Object.entries(auction.bidders)) {
                _bidderList.push(`${key} ha ofertado un total de ${value} CumbiaCoin (GAAAAAA) tokens`)
            }

            setBidderNamesList(_bidderList)
        }

        const  startAuctionTimer = async (auctionId) => {
            const auction = auctionData[auctionId];
            let auctionIntervals_ = auctionIntervals;

            auctionIntervals_[auctionId] = setInterval(async () => {
                if (auction.remainingTime > 0) {
                    auction.remainingTime--;

                    // Calcula los minutos y segundos restantes
                    const minutes = Math.floor(auction.remainingTime / 60);
                    const seconds = auction.remainingTime % 60;

                    // Formatea los segundos para que siempre tengan 2 dígitos
                    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

                    console.log({ minutes, seconds, currentAuction })
                    // Actualiza el temporizador solo si la subasta actual está en pantalla
                    if (currentAuction === auctionId) {
                        setTimerElement(`${minutes}:${formattedSeconds}`);
                    }
                } else {
                    // Limpia el intervalo y notifica el final de la subasta
                    clearInterval(auctionIntervals_[auctionId]);
                    auctionIntervals_[auctionId] = null;

                    if (currentAuction === auctionId) {
                        await finalizar(auctionId);
                        alert(`¡La subasta ha terminado! El ganador es ${auction.highestBidder} con una oferta de ${auction.currentBid} CumbiaCoin (GAAAAAA) tokens.`);
                        showWinnerModal(auction.highestBidder, auction.currentBid);
                    }
                }
            }, 1000);

            setAuctionIntervals(auctionIntervals_);
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

        const closeModal = () => {
            setShowModal(false)
            regresar();
        }

        
        const stopAuctionTimer = (auctionId) => {
            if (auctionIntervals[auctionId]) {
                clearInterval(auctionIntervals[auctionId]);
                auctionIntervals[auctionId] = null;
                console.log(`El temporizador de la subasta ${auctionId} se ha detenido.`);
            }
        };

        const regresar = () => {
            setAuctionScreen("none");
            setMainContentDisplay("flex")
            setBidderNamesList([])
            stopAuctionTimer(currentAuction)
            setCurrentAuction(null)
        }

        const agregarSubasta = async (subastaID, nombre, cantidad) => {
            await guardarSubasta(subastaID, nombre, cantidad)
        }

        const obtenerSubasta = async (subastaID) => {
            const bidders = await obtenerSubastas(subastaID)

            return bidders
        }

  return (
    <div className="app">
      <header>
          <h1>Subasta de Mesas VIP - Discoteca NAUTICA</h1>
      </header>
      <div className="app-container">
        <div className="container">
            {
                showForm &&
                <div>
                    <h2>Regístrate para participar en la subasta</h2>
                    <input type="text" placeholder="Nombres y Apellidos" value={fullname} onChange={e => setFullname(e.target.value)} />
                    <button id="registerButton" onClick={registerAucioneer}>Registrarse</button>
                    <p>{walletAddress}</p>
                    <button id="connectWallet" onClick={connectWallet}>Conectar Wallet Phantom</button>
                </div>
            }

            <div className="content" id="mainContent" style={{ display: mainContentDisplay }}>
                <div className="discoteca">
                    <h2>Maqueta de la Discoteca</h2>
                    <img src={DiscoNautica} style={{ width: '500px', height: 'auto' }} alt="nautica" />
                    <p>Disfruta de presentaciones exclusivas y artistas reconocidos, mientras te premian por ser uno de nuestros clientes más leales. En nuestra discoteca, valoramos tu preferencia, y ahora tienes la oportunidad de acceder a espacios exclusivos para vivir los eventos desde una perspectiva privilegiada.</p>
                    <p>¡Eleva tu experiencia y asegura un lugar especial en cada fiesta con los beneficios que solo nuestros clientes VIP pueden disfrutar!</p>
                </div>

                <div className="subasta">
                    <h2>Participa en la Subasta</h2>
                    <div className="auction-start-info">El día 30 de octubre a las 7 p.m. empezará la subasta para todos.</div>
                    <div className="mesa">
                        <h3>Espacio Mega Box 1 (15 personas)</h3>
                        <p>Ubicación cerca del escenario, puedes pasar una tarde junto a tus artistas favoritos, también puedes acceder a promociones que te damos en nuestro local.</p>
                        <p>Oferta mínima: 8 CumbiaCoin (GAAAAAA) Tokens</p>
                        <button onClick={() => subastar('Mega Box 1', 8)}>Participar en la Subasta</button>
                    </div>
                    <div className="mesa">
                        <h3>Espacio Mega Box 2 (10 personas)</h3>
                        <p>Ubicación cerca de la barra, acceso a fotos y promociones de consumo.</p>
                        <p>Oferta mínima: 5 CumbiaCoin (GAAAAAA) Tokens</p>
                        <button onClick={() => subastar('Mega Box 2', 5)}>Participar en la Subasta</button>
                    </div>
                    <div className="mesa">
                        <h3>Espacio Mega Box 3 (5 personas)</h3>
                        <p>Ubicación en área privada</p>
                        <p>Oferta mínima: 3 CumbiaCoin (GAAAAAA) Tokens</p>
                        <button onClick={() => subastar('Mega Box 3', 3)}>Participar en la Subasta</button>
                    </div>
                </div>
            </div>

            <div className="auction-screen" id="auctionScreen" style={{ display: auctionScreen }}>
                <h1>Subasta Activa - Discoteca NAUTICA</h1>
                <div className="auction-info">
                    <h2>Espacio en Subasta: <span>{auctionSpace}</span></h2>
                    <h3>Oferta Mínima: <span>{minBid}</span> CumbiaCoin (GAAAAAA) Tokens</h3>
                    <div id="timer">Tiempo restante: <span id="timeLeft">{timerElement}</span></div>
                    {
                        bidderNamesList.length > 0 && 
                        <div className="current-bid">Oferta más alta: <span id="currentBidValue">{currentBidValueElement}</span> CumbiaCoin (GAAAAAA) Tokens</div>
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
                                            { bidderName }
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

        <footer>
            <p>Discoteca Nautica - Subasta en Vivo | Solana Blockchain</p>
        </footer>
    </div>
  );
}

export default App;
