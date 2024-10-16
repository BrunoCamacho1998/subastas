import './App.css';

import { Navigate, Route, Routes } from 'react-router-dom';
import Register from './pages/register';
import SubastaDetail from './pages/subastaDetail';
import Subastas from './pages/subastas';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} ></Route>
            <Route path="/home" element={<Register />}></Route>
            <Route path="/subasta/:subastaID/:ofertaMinima" element={<SubastaDetail />}></Route>
            <Route path="/subastas" element={<Subastas />}></Route>
        </Routes>
    )
}

export default App;
