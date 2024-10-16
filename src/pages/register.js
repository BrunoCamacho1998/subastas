import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Register = () => {

    const navigate = useNavigate()

    const [phantomWallet, setPhantomWallet] = useState(null)

    const [walletAddress, setWalletAddress] = useState('')
    const [fullname, setFullname] = useState('')
    // const tokenMintAddress = "14UGL6smKzWeaXuUnCs5G3P8AZLP3LvKfMkyXkNDCPuq";


    // Modal


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
                    // sessionStorage.setItem("fullname", fullname)
                    // navigate("/subastas")
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
            sessionStorage.setItem("user", JSON.stringify({ fullname, phantomID: phantomWallet }))
            navigate("/subastas")
        } else {
            alert("Por favor, ingresa tus nombres y apellidos y conecta tu wallet.");
        }
    }

  return (
    <div className="app">
      <header>
          <h1>Subasta de Mesas VIP - Discoteca NAUTICA</h1>
      </header>
      <div className="app-container">
        <div className="container">
            <div>
                <h2>Regístrate para participar en la subasta</h2>
                <input type="text" placeholder="Nombres y Apellidos" value={fullname} onChange={e => setFullname(e.target.value)} />
                <button id="registerButton" onClick={registerAucioneer}>Registrarse</button>
                <p>{walletAddress}</p>
                <button id="connectWallet" onClick={connectWallet}>Conectar Wallet Phantom</button>
            </div>
        </div>
      </div>

        <footer>
            <p>Discoteca Nautica - Subasta en Vivo | Solana Blockchain</p>
        </footer>
    </div>
  );
}

export default Register