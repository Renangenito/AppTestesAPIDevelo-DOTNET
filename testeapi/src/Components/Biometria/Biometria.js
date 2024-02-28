import  { useState,useEffect } from 'react';
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import axios from 'axios';

import './Biometria.scss';

import "react-toastify/dist/ReactToastify.min.css";

export  default function Biometria(){      

  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
  } = useForm();

  const consultar = (data) => {
    
    setLoading(true);

    let params = {
      Id: data.Id,
    };
    
    axios({
      url: sessionStorage.getItem('apiUrl')+'Biometria/ObterPDF/'+params.Id, 
      headers: {
        Token: sessionStorage.getItem("auth")
      },
      method: 'GET',
      responseType: 'blob', 
    }).then((resposta) => {
        console.log(resposta);
        setLoading(false);
        setErro(undefined);
        setSucesso(resposta);
        const urlPDF = window.URL.createObjectURL(new Blob([resposta.data]));
        const link = document.createElement('a');
        link.href = urlPDF;
        link.setAttribute('download', 'file.pdf'); 
        document.body.appendChild(link);
        link.click();
    }).catch(erro=> {
      console.log(erro)
      setLoading(false);
      setErro("Status: "+erro.response.status+" - "+erro.response.statusText)
      setSucesso(undefined);            
    }); 

    }; 

    return(        
      <>
      <h1 className='text-center'> Teste Consultar Biometria </h1>
      <div className="container">
      <div className='body'>
      <div
        className="row d-flex justify-content-center align-items-center"
        style={{ height: "15vh" }}
      >
      <form className="form" noValidate autoComplete="off" onSubmit={handleSubmit(consultar)}>
        <div className='row d-flex justify-content-center align-items-center'>
        
        <div className="input-group mb-3">
        <input type="text" className="form-control" placeholder="Id" aria-label="" aria-describedby="basic-addon1"
        {...register("Id", {
          required: "Preencha o Id",
        })}/>
       
        <div className="input-group-append">          
          <button className="btn btn-outline-primary" type="submit">Consultar</button>
        </div>

        {sessionStorage.getItem("nomeUsuario").includes("BMG") ? (
                      <>
                        <div>
                          <Link to={"/Analises/EnviarBMG"}><button className="btn btn-warning" type="button">Enviar BMG </button></Link>
                        </div>
                      </>
                      ) : <div>
                            <Link to={"/Biometria/Enviar"}><button className="btn btn-success" type="button">Enviar Imagens</button></Link>
                          </div> 
        }
        </div>
        </div>
      </form>
      {loading &&
        <div class="spinner-border" role="status">
          <span class="sr-only"></span>
        </div>
      }
      {erro &&
        <div className="p-3 mb-2 bg-danger text-white text-center">{erro}</div>
      }
      {sucesso &&
        <>
        <div className="p-3 mb-2 bg-success text-white text-center">{"Status: "+sucesso.status+" - "+sucesso.statusText}</div>
        </>
      }
      </div>
      </div>
      </div>
      
      </>     
    )
}   


  


