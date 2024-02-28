import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Login from "./Components/Login/Login";
import { RequireAuth } from "./Auth/RequireAuth";
import Home from "./Components/Home/Home";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from "./Components/NavBar/Navbar";
import Biometria from "./Components/Biometria/Biometria";
import BiometriaEnviar from "./Components/Biometria/BiometriaEnviar";
import BiometriaFacial from "./Components/BiometriaFacial/BiometriaFacial";
import BiometriaFacialEnviar from "./Components/BiometriaFacial/BiometriaFacialEnviar";
import Ocr from "./Components/OCR/Ocr";
import OcrEnviar from "./Components/OCR/OcrEnviar";
import Analises from "./Components/Analises/Analises";
import AnalisesEnviar from "./Components/Analises/AnalisesEnviar";
import AnalisesEnviarBMG from "./Components/Analises/AnalisesEnviarBMG";
import OldAnalisesEnviarBMG from "./Components/Analises/AnalisesEnviarBMG_Old";
import Score from "./Components/Score/Score";
import ScoreEnviar from "./Components/Score/ScoreEnviar";
import Liveness from "./Components/Liveness/CameraMediaPipe_v1.0";
import GetHubLink from "./Components/Hub/GetHubLink";

import TesteStepper from "./Components/testeStepper";
import HubByWhatsapp from "./Components/Hub/HubByWhatsapp";


function AppRouter() {
  return (
      <Router>
      <Navbar />
        <Routes>
          <Route path="/teste" element={<TesteStepper/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="*" element={<RequireAuth><Home/></RequireAuth>}/>
          <Route path="/Biometria" element={<RequireAuth><Biometria/></RequireAuth>} />
          <Route path="/Biometria/Enviar" element={<RequireAuth><BiometriaEnviar/></RequireAuth>} />          
          <Route path="/BiometriaFacial" element={<RequireAuth><BiometriaFacial/></RequireAuth>} />
          <Route path="/BiometriaFacial/Enviar" element={<RequireAuth><BiometriaFacialEnviar/></RequireAuth>} />
          <Route path="/Analises" element={<RequireAuth><Analises/></RequireAuth>} />
          <Route path="/Analises/Enviar" element={<RequireAuth><AnalisesEnviar/></RequireAuth>} />
          <Route path="/Analises/EnviarBMG" element={<RequireAuth><AnalisesEnviarBMG/></RequireAuth>} />
          <Route path="/Analises/OldEnviarBMG" element={<RequireAuth><OldAnalisesEnviarBMG/></RequireAuth>} />
          <Route path="/Ocr" element={<RequireAuth><Ocr/></RequireAuth>} />
          <Route path="/Ocr/Enviar" element={<RequireAuth><OcrEnviar/></RequireAuth>} />
          <Route path="/Score" element={<RequireAuth><Score/></RequireAuth>} />
          <Route path="/Score/Enviar" element={<RequireAuth><ScoreEnviar/></RequireAuth>} />
          <Route path="/GetHubLink" element={<RequireAuth><GetHubLink/></RequireAuth>} />
          <Route path="/HubByWhatsapp" element={<RequireAuth><HubByWhatsapp/></RequireAuth>} />
          <Route path="/Liveness" element={<RequireAuth><Liveness/></RequireAuth>} />
          <Route path="/" element={<RequireAuth><Home/></RequireAuth>}/>
        </Routes>
      </Router>
  );
}

export default AppRouter;