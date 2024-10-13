import { useNavigate } from "react-router-dom";
import DiscoNautica from "../assets/images/disco_nautica.jpg";

const Subastas = () => {

    const navigate = useNavigate()

    const subastar = async (espacio, ofertaMinima) => {
        navigate("/subastas/subasta/" + espacio + "/" + ofertaMinima)
    }

    return (
        <div className="app">
            <header>
                <h1>Subasta de Mesas VIP - Discoteca NAUTICA</h1>
            </header>
            <div className="app-container">
                <div className="container">
                    <div className="content" id="mainContent" style={{ display: 'flex'}}>
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
                </div>
            </div>
            <footer>
                <p>Discoteca Nautica - Subasta en Vivo | Solana Blockchain</p>
            </footer>
        </div>
    )
}

export default Subastas