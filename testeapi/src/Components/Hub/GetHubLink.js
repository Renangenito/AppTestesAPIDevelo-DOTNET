import React, { useState } from 'react';
import { useForm } from "react-hook-form";

import api from "../../servicos/api";
import maskCPF from '../../Utilidades/maskCPF';
import Swal from 'sweetalert2';
import "react-toastify/dist/ReactToastify.min.css";

import "./GetHubLink.scss"

export default function GetHubLink (){

  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [cpf, setCPF] = useState("");
  const [documentos, setDocumentos] = useState([]);
  const [novoItem, setNovoItem] = useState("");

  const {
    register,
    handleSubmit,
  } = useForm();

  function adicionaDocumentos(){
      if(novoItem.length <=0){
          alert("Por favor, digite algo no campo");
          return;
      }

      let itemIndex = documentos.indexOf(novoItem);
      if(itemIndex >= 0){
          alert("Você já adicionou este tipo de documento");
          return;
      }

      setDocumentos([...documentos, novoItem])
      setNovoItem("");
  }

  function removerDocumento(index){
      let tmpArray = [...documentos];
      tmpArray.splice(index,1);

      setDocumentos(tmpArray);
  }

  const enviar = async (data) => {

    setLoading(true);


    let params = {
      CPFCliente: data.CpfCliente.split('.').join("").split('-').join(""),
      NomeCliente: data.NomeCliente,
      Chave: data.Chave,
      Telefone: data.Telefone,
      Url: data.Url,
      TiposDocumento: documentos      
    };

    const parametros =
      "?" +
      Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join("&");
    
    api.post('Hub/GetHubLink/', params)
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
      console.log(erro)
    })
    };

    return(        
      <>
      <h1 className='text-center'> Teste Receber Link do Hub </h1>
      <div className="container">
      <div
        className="row d-flex justify-content-center align-items-center"
        style={{ height: "15vh" }}
      >
      <form className="form" noValidate autoComplete="off" onSubmit={handleSubmit(enviar)}>
        <div className='justify-content-center align-items-center'>


        <label htmlFor="">Chave</label>
        <input type="text" className="form-control mb-2" placeholder="Chave" aria-label="" aria-describedby="basic-addon1"
        {...register("Chave", {
          required: "Preencha a chave",
        })}/>

          <label htmlFor="" >CPF</label>
          <input type="text" className="form-control mb-1" placeholder="CPF do Cliente" aria-label="" aria-describedby="basic-addon1"
          {...register("CpfCliente", {
            required: "Preencha o CPF",
          })}
          value={cpf}
          onChange={(e) => setCPF(maskCPF(e.target.value))}/>

          <div className='row'>
            <div className='col col-6'>
              <label htmlFor="">Nome do Cliente</label>
              <input type="text" className="form-control mb-2" placeholder="Nome do Cliente" aria-label="" aria-describedby="basic-addon1"
              {...register("NomeCliente", {
                required: "Preencha o Nome",
              })}/>
            </div>
            <div className='col col-md-4'>
              <label htmlFor="">Tipo de Documento(Opcional)</label>
              <input  type="text" id='tipoDocumento' className="form-control mb-2" 
              placeholder="Digite um Tipo de documento" aria-label="" aria-describedby="basic-addon1" value={novoItem} onChange={value => setNovoItem(value.target.value)}/>

            </div>
            <div className="col col-2 text-center">
              <button id='add' type='button' className='btn btn-info mt-4' onClick={() => adicionaDocumentos()}> Adicionar</button>
            </div>

            
          </div>

          <div className='row'>

            <div className='col col-sm'>
              <div className='row'>

                <div className='col col-sm'>
                  <div className='well'> 
                    <label htmlFor="">Telefone</label>
                    <input type="text" className="form-control mb-2" placeholder="Telefone" aria-label="" aria-describedby="basic-addon1"
                    {...register("Telefone", {
                      required: "Preencha o Telefone",
                    })}/>
                  </div>
                </div>
              </div>
              <div className='row'>                
                <div className='col col-sm'> 
                  <div className='well'> 
                    <label htmlFor="">Url (Opcional)</label>
                    <input type="text" className="form-control mb-2" placeholder="Digite uma Url para ser redirecionado" aria-label="" aria-describedby="basic-addon1"
                    {...register("Url", {
                    })}/> 
                  </div>
                </div>
              </div>
            </div>
            <div className='col col-sm'>
                <div className='well'>                                               
                  <div className='caixa'>
                      <ul className='listaDocumentos'>
                        {documentos.map((item,index) => (
                          <li className='itemDocumento'>
                            <div className='text-center'>{item}</div>
                            <button className='btn btn-danger' onClick={() => removerDocumento(index)}>
                                Remover
                            </button>
                          </li>
                        ))}
                      </ul>
                  </div> 
                </div>
            </div>
            
          </div>
          
          
        <div className="d-inline">
          <button className="btn btn-outline-success mb-3" type="submit">Receber Link</button>
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
        <>   
        <div className="p-3 mb-2 bg-success text-white text-center">{"Status: "+sucesso.status+" - "+sucesso.data.Mensagens}</div>
        <div className='link-hub' >
          <p><strong>Link para o Hub: </strong> <a href={sucesso.data.URL} target='_blank' rel="noreferrer">{sucesso.data.URL}</a></p>
        </div>
        </>   
      }
      </div>
      </div>
      
      </>     
    )
  }   

  


