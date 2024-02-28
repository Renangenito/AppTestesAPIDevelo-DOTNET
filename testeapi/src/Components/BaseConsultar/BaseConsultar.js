import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import Swal from "sweetalert2";

import "react-toastify/dist/ReactToastify.min.css";

import "./BaseConsultar.scss";
import api from "../../servicos/api";

export default function BaseConsultar({ parentApi }) {
  useEffect(() => {
    api.defaults.baseURL = sessionStorage.getItem("apiUrl");
    api.defaults.headers.common["Token"] = sessionStorage.getItem("auth");
  });

  const [sucesso, setSucesso] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm();

  const consultar = (data) => {
    setLoading(true);

    let params = {
      Chave: data.Chave,
    };

    const parametros =
      "?" +
      Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join("&");

    api
      .get(parentApi + "/Consultar" + parametros)
      .then((resposta) => {
        setErro(undefined);
        setSucesso(resposta);
        Swal.fire({
          title: resposta.status,
          text: "Requisição Concluída com Sucesso",
          icon: "success",
          confirmButtonText: "Ok",
        });
        setLoading(false);
      })
      .catch((erro) => {
        setLoading(false);
        setErro(
          "Status: " +
            erro.response.status +
            " - " +
            erro.response.data.Mensagens
        );
        setSucesso(undefined);
        Swal.fire({
          title: erro.response.data.Mensagens[0],
          text: "status: " + erro.response.status,
          icon: "error",
          confirmButtonText: "Ok",
        });
      });
  };

  return (
    <>
      <h1 className="text-center"> Teste Consultar {parentApi} </h1>
      <div className="container">
        <div className="body">
          <div
            className="row d-flex justify-content-center align-items-center"
            style={{ height: "15vh" }}
          >
            <form
              className="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(consultar)}
            >
              <div className="row d-flex justify-content-center align-items-center">
                <div className="input-group mb-3 col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Chave"
                    aria-label=""
                    aria-describedby="basic-addon1"
                    {...register("Chave", {
                      required: "Preencha a chave",
                    })}
                  />

                  <div className="col-md-2">
                    <button className="btn btn-outline-primary" type="submit">
                      Consultar
                    </button>
                  </div>
                  {sessionStorage.getItem("nomeUsuario").includes("BMG") ? (
                      <>
                      <div className="col-md-2">                  
                        <div>
                          <Link to={"/Analises/EnviarBMG"}><button className="btn btn-warning" type="button">Enviar BMG Lista</button></Link>
                        </div>
                      </div>
                      <div className="col-md-2">                          
                        <div>
                          <Link to={"/Analises/OldEnviarBMG"}><button className="btn btn-warning" type="button">Enviar BMG Old</button></Link>
                        </div>
                      </div>
                      </>
                      ) : <div>
                            <Link to={"/"+parentApi+"/Enviar"}><button className="btn btn-success" type="button">Enviar Imagens</button></Link>
                          </div> 
                  } 
                </div>
              </div>
            </form>
            {loading && (
              <div className="spinner-border" role="status">
                <span className="sr-only"></span>
              </div>
            )}
            {erro && (
              <div className="p-3 mb-2 bg-danger text-white text-center">
                {erro}
              </div>
            )}
            {sucesso && (
              <>
                <div className="p-3 mb-2 bg-success text-white text-center">
                  {"Status: " + sucesso.status + " - " + sucesso.data.Mensagens}
                </div>
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="25"
                  value={JSON.stringify(sucesso.data, null, 2)}
                  readOnly
                ></textarea>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
  /* return (
    <>
      <h1 className="text-center"> Teste Consultar {parentApi} </h1>
      <div className="container">
        <div className="body">
          <div
            className="row d-flex justify-content-center align-items-center"
            style={{ height: "15vh" }}
          >
            <form
              className="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(consultar)}
            >
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Chave"
                  aria-label=""
                  aria-describedby="basic-addon1"
                  {...register("Chave", {
                    required: "Preencha a chave",
                  })}
                />

                <div className="input-group-append">
                  <button className="btn btn-outline-primary" type="submit">
                    Consultar
                  </button>
                  <div>
                    <Link to={"/" + parentApi + "/Enviar"}>
                      <button className="btn btn-success" type="button">
                        Enviar Imagens
                      </button>
                    </Link>
                  </div>
                  {/* {parentApi === 'Analises' ? (
                      <>
                        <div >
                          <Link to={"/"+parentApi+"/Enviar"}><button className="btn btn-success" type="button">Enviar Imagens</button></Link>
                        </div>
                        <div>
                          <Link to={"/"+parentApi+"/EnviarBMG"}><button className="btn btn-warning" type="button">Enviar BMG </button></Link>
                        </div>
                      </>
                      ) : <div>
                            <Link to={"/"+parentApi+"/Enviar"}><button className="btn btn-success" type="button">Enviar Imagens</button></Link>
                          </div> 
                      } 
                </div>
              </div>
            </form>
            {loading && (
              <div className="spinner-border" role="status">
                <span className="sr-only"></span>
              </div>
            )}
            {erro && (
              <div className="p-3 mb-2 bg-danger text-white text-center">
                {erro}
              </div>
            )}
            {sucesso && (
              <>
                <div className="p-3 mb-2 bg-success text-white text-center">
                  {"Status: " + sucesso.status + " - " + sucesso.data.Mensagens}
                </div>
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="25"
                  value={JSON.stringify(sucesso.data, null, 2)}
                  readOnly
                ></textarea>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  ); */
            };

