import { useState } from 'react';
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import api from "../../servicos/api";
import maskCPF from '../../Utilidades/maskCPF';
import Swal from 'sweetalert2'
import uploadImage from "../../Utilidades/UploadImagens";

import "react-toastify/dist/ReactToastify.min.css";



export default function BiometriaEnviar (){

  const [cpf, setCPF] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
  } = useForm();

  const enviar = async (data) => {

    setLoading(true);

    if(data.ImagemFrente.length !== 0){
      data.ImagemFrente = await uploadImage(data.ImagemFrente[0]);
      data.ImagemFrente = data.ImagemFrente.substring(data.ImagemFrente.indexOf(',')+1)
    }else data.ImagemFrente = "";

    if(data.ImagemVerso.length !== 0){
      data.ImagemVerso = await uploadImage(data.ImagemVerso[0]);
      data.ImagemVerso = data.ImagemVerso.substring(data.ImagemVerso.indexOf(',')+1)
    }else data.ImagemVerso = "";
    
    if(data.ImagemSelfie.length !== 0){
      data.ImagemSelfie = await uploadImage(data.ImagemSelfie[0]);
      data.ImagemSelfie = data.ImagemSelfie.substring(data.ImagemSelfie.indexOf(',')+1)
    }else data.ImagemSelfie = "";

    let params = {
      Chave: data.Chave,
      ImagemFrente: data.ImagemFrente,
      ImagemVerso: data.ImagemVerso,
      ImagemSelfie: data.ImagemSelfie,
      CPF: data.CPF
    };
    
    api.post('Biometria/Enviar/', params)
    .then(resposta =>{     
      
      Swal.fire({
        title: resposta.status,
        text: 'Requisição Concluída com Sucesso', 
        icon: 'success',
        confirmButtonText: 'Ok'
      })
      setSucesso(resposta);
      setErro("");
      setLoading(false);
      console.log(resposta);
    })
    .catch(erro=> {  
      
      Swal.fire({
        title: erro.code,
        text: erro.response.data.Mensagens, 
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      setSucesso("");
      setErro(erro.response);
      setLoading(false)
    })
    };

    return(        
      <>
      <h1 className='text-center mb-4'> Teste Biometria Enviar </h1>
      <div className="container">
      <div
        className="row d-flex justify-content-center align-items-center"
        style={{ height: "15vh" }}
      >
      <form className="form" noValidate autoComplete="off" onSubmit={handleSubmit(enviar)}>
        <div className='row'>
          <div className="col-md-12 ">
          <label htmlFor="" >Chave</label>
              <input type="text" className="form-control shadow-sm p-2 bg-white rounded mb-2" placeholder="Chave" aria-label="" aria-describedby="basic-addon1"
              {...register("Chave", {
                required: "Preencha a chave",
              })}/>
          </div>
          <div className="col-md-12">
          <label htmlFor="" >CPF</label>
              <input type="text" className="form-control shadow-sm  p-2 bg-white rounded mb-2" placeholder="CPF" aria-label="" aria-describedby="basic-addon1"
              {...register("CPF", {
                required: "Preencha o CPF",
              })}
              value={cpf}
              onChange={(e) => setCPF(maskCPF(e.target.value))}/>
          </div>
        </div>
        
        <label htmlFor="">Imagem Frente</label>
        <input type="file" className="form-control shadow-sm   bg-white rounded mb-2"
        {...register("ImagemFrente", {
          required: "Escolha a Imagem",
        })}/> 
        <label htmlFor="">Imagem Verso</label>
        <input type="file" className="form-control shadow-sm   bg-white rounded mb-2"
        {...register("ImagemVerso", {
        })}/> 
        <label htmlFor="">Imagem Selfie</label>
        <input type="file" className="form-control shadow-sm   bg-white rounded mb-2"
        {...register("ImagemSelfie", {
        })}/> 
        <div className="d-inline">
          <button className="btn btn-outline-success mb-4" type="submit">Enviar</button>
        </div>
        <div className="d-inline ">
          <Link to={"/Biometria"}><button className="btn btn-primary mb-4" type="button">Voltar</button></Link>
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
        <>
        <div className="p-3 mb-2 bg-success text-white text-center">{"Status: "+sucesso.status+" - "+sucesso.data.Mensagens}</div>
        <textarea name="" id="" cols="30" rows="10" defaultValue={JSON.stringify(sucesso.data,null,2)}></textarea>      
        </>
      }
      </div>
      </div>
      
      </>     
    )
  }   

  


