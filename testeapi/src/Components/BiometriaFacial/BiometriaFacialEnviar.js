import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import api from "../../servicos/api";
import maskCPF from '../../Utilidades/maskCPF';
import Swal from 'sweetalert2'
import uploadImage from "../../Utilidades/UploadImagens";

import "react-toastify/dist/ReactToastify.min.css";

export default function BiometriaFacialEnviar (){

  const [cpf, setCPF] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
  } = useForm();

  const enviar = async (data) => {
    console.log(data.ImagemSelfie.length);
    data.CPF = cpf;

    data.ImagemSelfie = await uploadImage(data.ImagemSelfie[0]);
    const imagemSelfieSemMimo = data.ImagemSelfie.substring(data.ImagemSelfie.indexOf(',')+1)    
  
    setLoading(true);

    let params = {
      Chave: data.Chave,
      CPF: data.CPF,
      Nome: data.Nome,
      DataNascimento: data.DataNascimento,
      ImagemSelfie: imagemSelfieSemMimo,
    };
    
    api.post('BiometriaFacial/Enviar/', params)
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
     
      console.log(resposta);
    })
    .catch(erro=> {
      setSucesso("");
      setErro(erro.response);
      setLoading(false);     
      Swal.fire({
        title: erro.code,
        text: erro.response.data.Mensagens, 
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      console.log(erro);   
    })
    };

    return(        
      <>
      <h1 className='text-center'> Teste Biometria Facial Enviar </h1>
      <div className="container">
      <div
        className="row d-flex justify-content-center align-items-center"
        style={{ height: "15vh" }}
      >
      <form className="form" noValidate autoComplete="off" onSubmit={handleSubmit(enviar)}>
        <div className='justify-content-center align-items-center'>

        <label htmlFor="" >Chave</label>
        <input type="text" className="form-control mb-2" placeholder="Chave" aria-label="" aria-describedby="basic-addon1"
        {...register("Chave", {
          required: "Preencha a chave",
        })}/>

        <label htmlFor="" >CPF</label>
        <input type="text" className="form-control mb-2" placeholder="CPF" aria-label="" aria-describedby="basic-addon1"
        {...register("CPF", {
          required: "Preencha o CPF",
        })}
        value={cpf}
        onChange={(e) => setCPF(maskCPF(e.target.value))}/>

        <label htmlFor="" >Nome</label>
        <input type="text" className="form-control mb-2" placeholder="Nome" aria-label="" aria-describedby="basic-addon1"
        {...register("Nome", {
          required: "Preencha o Nome",
        })}/>

        <label htmlFor="" >Data de Nascimento</label>
        <input type="date" className="form-control mb-2" placeholder="Data de Nascimento" aria-label="" aria-describedby="basic-addon1"
        {...register("DataNascimento", {
          required: "Preencha a Data de Nascimento",
        })}/>

        <label htmlFor="" >Imagem Selfie</label>        
        <input type="file" className="form-control mb-3"
        {...register("ImagemSelfie", {
          required: "Escolha uma Imagem",
        })}/> 
        
        <div className="d-inline">
          <button className="btn btn-outline-success mb-3" type="submit">Enviar</button>
        </div>
        <div className="d-inline">
          <Link to={"/BiometriaFacial"}><button className="btn btn-primary mb-3" type="button">Voltar</button></Link>
        </div>
          
        </div>
      </form>
      {loading &&
        <div class="spinner-border" role="status">
          <span class="sr-only"></span>
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

  


