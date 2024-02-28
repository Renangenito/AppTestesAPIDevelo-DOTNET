import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import  { useState } from 'react';

import api from "../../servicos/api";
import Swal from 'sweetalert2'
import uploadImage from "../../Utilidades/UploadImagens";

import "react-toastify/dist/ReactToastify.min.css";

export default function OcrEnviar (){

  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
  } = useForm();

  const enviar = async (data) => {

    console.log(data);

    setLoading(true);

    if(data.ImagemFrente.length !== 0){
      data.ImagemFrente = await uploadImage(data.ImagemFrente[0]);
      data.ImagemFrente = data.ImagemFrente.substring(data.ImagemFrente.indexOf(',')+1)
    }else data.ImagemFrente = "";

    if(data.ImagemVerso.length !== 0){
      data.ImagemVerso = await uploadImage(data.ImagemVerso[0]);
      data.ImagemVerso = data.ImagemVerso.substring(data.ImagemVerso.indexOf(',')+1)
    }else data.ImagemVerso = "";
    
    
    api.post('Score/Enviar/', data)
    .then(resposta =>{
      setSucesso(resposta);
      setErro("");
      setLoading(false);     
      Swal.fire({
        title: resposta.status,
        text: 'Requisição Concluída com Sucesso', 
        icon: 'success',
        confirmButtonText: 'Ok'
      })
    })
    .catch(erro=> {
      console.log(erro);
      setSucesso("");
      setErro(erro.response);
      setLoading(false);       
      Swal.fire({
        title: erro.code,
        text: erro.response.data.Mensagens, 
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    })
    };

    return(        
      <>
      <h1 className='text-center mb-2'> Teste Score Enviar </h1>
      <div className="container">
      <div
        className="row d-flex justify-content-center align-items-center"
        style={{ height: "15vh" }}
      >
      <form className="form" noValidate autoComplete="off" onSubmit={handleSubmit(enviar)}>
        <div className=' justify-content-center align-items-center'>

        <label htmlFor="">Chave</label>
        <input type="text" className="form-control mb-2" placeholder="Chave" aria-label="" aria-describedby="basic-addon1"
        {...register("Chave", {
          required: "Preencha a chave",
        })}/>

        <label htmlFor="">Imagem Frente</label>
        <input type="file" className="form-control mb-2"
        {...register("ImagemFrente", {
          required: "Escolha uma Imagem",
        })}/> 

        <label htmlFor="">Imagem Verso</label>
        <input type="file" className="form-control mb-2" 
        {...register("ImagemVerso", {
        })}/>

        
        <div className="d-inline">
          <button className="btn btn-outline-success mb-3" type="submit">Enviar</button>
        </div>
        <div className="d-inline">
          <Link to={"/Score"}><button className="btn btn-primary mb-3" type="button">Voltar</button></Link>
        </div>
          
        </div>
      </form>

      {loading &&
        <div className="spinner-border" role="status">
          <span className="sr-only"></span>
        </div>
      }
      {erro &&
        <div className="p-3 mb-2 bg-danger text-white text-center">{"Status: "+erro.status+" - "+erro.data.Mensagens}</div>      
      }
      {sucesso &&
        <div className="p-3 mb-2 bg-success text-white text-center">{"Status: "+sucesso.status+" - "+sucesso.data.Mensagens}</div>        
      }
      </div>
      </div>
      
      </>     
    )
  }   

  


