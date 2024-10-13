import './App.css';

import { Navigate, Route, Routes } from 'react-router-dom';
import Register from './pages/register';
import SubastaDetail from './pages/subastaDetail';
import Subastas from './pages/subastas';

function App() {
    return (
        <Routes>
            <Route path="/subastas" element={<Navigate to="/subastas/home" replace />} ></Route>
            <Route path="/subastas/home" element={<Register />}></Route>
            <Route path="/subastas/subasta/:subastaID/:ofertaMinima" element={<SubastaDetail />}></Route>
            <Route path="/subastas/subastas" element={<Subastas />}></Route>
        </Routes>
    )
}

export default App;
