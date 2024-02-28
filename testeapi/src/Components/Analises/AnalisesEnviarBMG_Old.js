import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import React from 'react';

import api from "../../servicos/api";
import maskCPF from "../../Utilidades/maskCPF";
import Swal from "sweetalert2";
import uploadImage from "../../Utilidades/UploadImagens";

import "react-toastify/dist/ReactToastify.min.css";

export default function BMGEnviar_Old() {
  const [cpf, setCPF] = useState("");
  const [sucesso, setSucesso] = useState();
  const [erro, setErro] = useState();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm();

  const enviar = async (data) => {
    setLoading(true);

    console.log(data);
    
    if (data.ImagemFrente.length !== 0) {
      data.ImagemFrente = await uploadImage(data.ImagemFrente[0]);
      data.ImagemFrente = data.ImagemFrente.substring(
        data.ImagemFrente.indexOf(",") + 1
      );
    } else data.ImagemFrente = "";

    if (data.ImagemVerso.length !== 0) {
      data.ImagemVerso = await uploadImage(data.ImagemVerso[0]);
      data.ImagemVerso = data.ImagemVerso.substring(
        data.ImagemVerso.indexOf(",") + 1
      );
    } else data.ImagemVerso = "";

    if (data.ImagemSelfie.length !== 0) {
      data.ImagemSelfie = await uploadImage(data.ImagemSelfie[0]);
      data.ImagemSelfie = data.ImagemSelfie.substring(
        data.ImagemSelfie.indexOf(",") + 1
      );
    } else data.ImagemSelfie = "";

    if (data.ImagemQrCode.length !== 0) {
      data.ImagemQrCode = await uploadImage(data.ImagemQrCode[0]);
      data.ImagemQrCode = data.ImagemQrCode.substring(
        data.ImagemQrCode.indexOf(",") + 1
      );
    } else data.ImagemQrCode = "";

    api
      .post("Analises/EnviarBMG/", data)
      .then((resposta) => {
        setSucesso(resposta);
        setErro("");
        setLoading(false);
        Swal.fire({
          title: resposta.status,
          text: "Requisição Concluída com Sucesso",
          icon: "success",
          confirmButtonText: "Ok",
        });
      })
      .catch((erro) => {
        console.log(erro);
        setSucesso("");
        setErro(erro.response);
        setLoading(false);
        Swal.fire({
          title: erro.code,
          text: erro.message,
          icon: "error",
          confirmButtonText: "Ok",
        });
      });
  };

  return (
    <>

      <h1 className="text-center mb-4"> Teste Analises BMG Enviar Antigo</h1>
      <div className="container">
        <form
          className="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(enviar)}
        >
          <div
            className="row d-flex justify-content-center align-items-center"
            style={{ height: "10vh" }}
          >
            <div className="col-sm">
              <label htmlFor="">Produto</label>
              <input
                type="text"
                className="form-control mb-5"
                placeholder="Produto"
                {...register("Produto", {
                })}
              />
            </div>

            <div className="col-sm">
              <label htmlFor="">Familia</label>
              <input
                type="text"
                className="form-control mb-5"
                placeholder="Familia"
                {...register("Familia", {
                })}
              />
            </div>

            <div className="col-sm">
              <label htmlFor="">Contrato</label>
              <input
                type="text"
                className="form-control mb-5"
                placeholder="Contrato"
                {...register("Contrato", {
                })}
              />
            </div>
          </div>

          <div className="justify-content-center align-items-center">
            <div
              className="row d-flex justify-content-center align-items-center"
              style={{ height: "10vh" }}
            >
              <div className="col-sm">
                <label htmlFor="">Chave</label>
                <input
                  type="text"
                  className="form-control mb-5"
                  placeholder="Chave"
                  aria-label=""
                  aria-describedby="basic-addon1"
                  {...register("Chave", {
                    required: "Preencha a chave",
                  })}
                />
              </div>
              <div className="col-sm">
                <label htmlFor="">CPF</label>
                <input
                  type="text"
                  className="form-control mb-5"
                  placeholder="CPF"
                  aria-label=""
                  aria-describedby="basic-addon1"
                  {...register("CPF", {
                    required: "Preencha o CPF",
                  })}
                  value={cpf}
                  onChange={(e) => setCPF(maskCPF(e.target.value))}
                />
              </div>
              <div className="col-sm">
                <label htmlFor="">Imagem Frente</label>
                <input
                  type="file"
                  className="form-control mb-5"
                  {...register("ImagemFrente", {
                    required: "Escolha a Imagem",
                  })}
                />
              </div>
            </div>

            <div
              className="row d-flex justify-content-center align-items-center"
              style={{ height: "10vh" }}
            >
              <div className="col-sm">
                <label htmlFor="">Imagem Verso</label>
                <input
                  type="file"
                  className="form-control mb-5"
                  {...register("ImagemVerso", {})}
                />
              </div>
              <div className="col-sm">
                <label htmlFor="">Imagem Selfie</label>
                <input
                  type="file"
                  className="form-control mb-5"
                  {...register("ImagemSelfie", {})}
                />
              </div>
              <div className="col-sm">
                <label htmlFor="">Imagem Qr Code</label>
                <input
                  type="file"
                  className="form-control mb-5"
                  {...register("ImagemQrCode", {})}
                />
              </div>
            </div>
            
            <div className="d-inline">
              <button className="btn btn-outline-success mb-1" type="submit">
                Enviar
              </button>
            </div>
            <div className="d-inline">
              <Link to={"/Analises"}>
                <button className="btn btn-primary mb-1" type="button">
                  Voltar
                </button>
              </Link>
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
            {"Status: " + erro.status + " - " + erro.data.Mensagens}
          </div>
        )}
        {sucesso && (
          <div className="p-3 mb-2 bg-success text-white text-center">
            {"Status: " + sucesso.status + " - " + sucesso.data.Mensagens}
          </div>
        )}
     </div>

    </>
  );
}

