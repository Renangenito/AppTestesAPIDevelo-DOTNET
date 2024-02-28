import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import api from '../../servicos/api'
import logo from '../../imagens/LOGO.svg'
import preval from 'preval.macro'

import './Login.scss';

export default function Login () {

  const navigate = useNavigate();

  const dateTimeStamp = preval`module.exports = new Date().toLocaleString();`

  function OrganizaUrl(url){
    if(!url.includes('https://'))
      url = 'https://' + url
    if(url.slice(-1) !== '/')
      url = url + '/'
    return url;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const login = (data) => {

    data.Url = OrganizaUrl(data.Url)
    sessionStorage.setItem("apiUrl", data.Url)
    sessionStorage.setItem("nomeUsuario", data.Usuario)
    
    const mensagem = toast.loading('logando',{
      position: "top-center",
    })

    let params = {
      Usuario: data.Usuario,
      Senha: data.Senha,
    };

    axios
      .post(data.Url+"Autenticar/Login/", params)
      .then(function (response) {
          if(response.data.Status === 0){
            toast.update(mensagem, {
              position: "top-center",
              type: 'success',
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: 0,
              toastId: "my_toast",
            });

            sessionStorage.setItem("auth", response.data.Token);
            api.defaults.baseURL = data.Url;

            setTimeout(() => {
              navigate("/");
            }, 1000)  

          }else{
            toast.update(mensagem, {
              position: "top-center",
              render: response.data.Mensagens[0],
              autoClose: 1000,
              type: 'error',
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: 0,
              isLoading: false,
              toastId: "my_toast",
            });
          }          
          
      })
      .catch(function (error) {
        console.log(error);
        if(error.response.status === 404 || error.code === "ERR_NETWORK"){
          toast.update(mensagem, {
            position: "top-center",
            render: 'Url não encontrada',
            autoClose: 1000,
            type: 'error',
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: 0,
            isLoading: false,
            toastId: "my_toast",
          });
        }
        else{
          toast.update(mensagem, {
            position: "top-center",
            render: error.response.data.Mensagens[0],
            autoClose: 1000,
            type: 'error',
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: 0,
            isLoading: false,
            toastId: "my_toast",
          });
        }      
      });
  };

  return (
    <>
    <div className='login'>
      <div className="container"> 
        <div
          className="row d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="card mb-5" style={{ maxWidth: "420px" }}>
            <div className="col-md-12">
              <div className="card-body">
     
                <img src={logo} className='mb-4 container' alt="logo acertpix" />
                <form autoComplete="off" onSubmit={handleSubmit(login)}>                      
                  <div className="mb-3">

                    <label className="form-label" htmlFor='url'>Url da Api</label>
                    <input
                      placeholder='Preencha a Url da API'
                      type="text"
                      className="form-control shadow-sm p-2"
                      id="url"
                      {...register("Url", {
                        required: "Preencha a Url",
                      })}
                    />
                    {errors.Url && (
                      <p className="text-danger" style={{ fontSize: 14 }}>
                         {errors.Url.message} 
                      </p>
                    )}
                  </div>
                  
                  <div className='credApi'>
                    
                    <div className="mb-3 ">
                      <h4 id='credApi'>Credenciais da API</h4>
                      <label className="form-label" htmlFor='usuario'>Usuario</label>
                      <input
                        placeholder='Preencha Usuario'
                        type="text"
                        className="form-control shadow-sm p-2"
                        id="usuario"
                        {...register("Usuario", { required: "Usuario is required!" })}
                      />
                      {errors.Usuario && (
                        <p className="text-danger" style={{ fontSize: 14 }}>
                          {errors.Usuario.message}  
                        </p>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor='senha'>Senha</label>
                      <input
                        placeholder='Preencha a senha'
                        type="password"
                        className="form-control shadow-sm p-2"
                        id="senha"
                        {...register("Senha", {
                          required: "Senha is required!",
                        })}
                      />
                      {errors.Senha && (
                        <p className="text-danger" style={{ fontSize: 14 }}>
                          {errors.Senha.message} 
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-center mt-4 ">
                  
                    <button
                      className="btn btn-primary text-center shadow-none mb-3"
                      type="submit"
                    >
                      Login
                    </button>
                  </div>
                  Última Build: {dateTimeStamp}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        limit={1}
        transition={Flip}
      />
    </>
  );
};
