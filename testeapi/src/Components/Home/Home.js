import { useEffect } from "react";
import api from '../../servicos/api';
//import {react-app-env.d.ts} from '../../react-app-env.d.ts';

export default function Home(){

  useEffect(() => {
    api.defaults.headers.Token = sessionStorage.getItem("auth"); 
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: 50,
          paddingRight: 50,
        }}
      >
      </div>
      <div className="container">
        <div
          className="row d-flex justify-content-center align-items-center text-center"
          style={{ height: "75vh" }}
        >        
          <p className="muted display-6">Bora Testar! 🧪</p>
        </div>
      </div>
    </>
  );
};
