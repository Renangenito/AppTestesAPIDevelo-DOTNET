import { FaceMesh } from "@mediapipe/face_mesh";
import React, { useRef, useEffect, useState } from "react";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { isMobile } from "react-device-detect";

import "./Camera.scss";

const alert_backup = alert;

alert = function (text) {
  if (text.includes("Failed to acquire camera feed")) {
    console.log("IGNORE ALERT");
    return true;
  }
  alert_backup(text);
  return true;
};

const CameraMediaPipe = () => {
  const [info, setInfo] = useState();

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var isCameraLandscape = true;
  var camera = useRef(null);
  const [stepCompleted, setStep] = useState(null);
  var photo1_base64 = null;
  var photo2_base64 = null;

  const ResolutionsToCheck = [
    { width: 640, height: 480 },
    { width: 800, height: 600 },
    { width: 480, height: 360 },
    { width: 960, height: 720 },
    { width: 384, height: 288 },
    { width: 320, height: 240 },
    { width: 192, height: 144 },
    { width: 160, height: 120 },
  ];
  var count_resolution = 0;

  let coordenateData = null;
    let videoWidth = 0;
    let videoHeight = 0;
    let canvasElement = null;
    let canvasCtx = null;

  var mockup = new Image();
  mockup.src = "imagens/acertpix-face-frame-red.png";

  // 0 = centralize; 1 = get closer; 2 = get further away
  var status = 0;
  var time_detected = Date.now();
  // Time to stay in position (miliseconds)
  var time_detecting = 2000;
  var detected = false;


  useEffect(() => {
    openCamera();
  }, []);

  function refresh(){
    window.location.reload(false);
  }

  function openCamera (){
    setInfo(null);
    setStep(false);
    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });
  
    faceMesh.setOptions({
      maxNumFaces: 1,
      selfieMode: true,
      refineLandmarks: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      useCpuInference: true
    });

    faceMesh.onResults(onResults);
  
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      // Search webcam resolution available
      const camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await faceMesh.send({ image: webcamRef.current.video });
        },
        width: { min: ResolutionsToCheck[count_resolution].width, max: ResolutionsToCheck[count_resolution].width },
        height: { min: ResolutionsToCheck[count_resolution].height, max: ResolutionsToCheck[count_resolution].height },
      });
    camera.start().catch(checkErrorResolution);
    }
  
    function checkErrorResolution() {
      count_resolution++;
      if (count_resolution > ResolutionsToCheck.length){
        alert('Câmera não suportada!');
        return false;
      } else {
        const camera = new cam.Camera(webcamRef.current.video, {
          onFrame: async () => {
            await faceMesh.send({ image: webcamRef.current.video });
          },
          width: { min: ResolutionsToCheck[count_resolution].width, max: ResolutionsToCheck[count_resolution].width },
          height: { min: ResolutionsToCheck[count_resolution].height, max: ResolutionsToCheck[count_resolution].height },
        });
        camera.start().catch(checkErrorResolution);
      }
    
    }

  };

  function onResults(results) {
    if (coordenateData == null) {
      videoWidth = webcamRef.current.video.videoWidth;
      videoHeight = webcamRef.current.video.videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
  
      canvasElement = canvasRef.current;
      canvasCtx = canvasElement.getContext("2d");

      coordenateData = videoWidth > videoHeight ?
        // Landscape
        {
          // Face far - coordenate X - bigger then - id 93
          far_xb_93: 0.32,
          // Face far - coordenate X - smaller then - id 93
          far_xs_93: 0.39,
          far_xs_323: 0.68,
          far_xb_323: 0.61,
          far_yb_10: 0.216,
          far_ys_10: 0.356,
          far_ys_152: 0.795,
          far_yb_152: 0.665,

          close_xb_93: 0.244,
          close_xs_93: 0.33,
          close_xs_323: 0.755,
          close_xb_323: 0.67,
          close_yb_10: 0.11,
          close_ys_10: 0.30,
          close_ys_152: 0.956,
          close_yb_152: 0.816,

          far_mockup_w1: 3.1,
          far_mockup_h1: 4.5,
          far_mockup_w2: 2.8,
          far_mockup_h2: 1.9,

          close_mockup_w1: 4,
          close_mockup_h1: 6,
          close_mockup_w2: 2,
          close_mockup_h2: 1.4
        }
      : 
        // Not landscape
        {
          far_xb_93: 0.22,
          far_xs_93: 0.30,
          far_xs_323: 0.75,
          far_xb_323: 0.67,
          far_yb_10: 0.216,
          far_ys_10: 0.356,
          far_ys_152: 0.795,
          far_yb_152: 0.665,

          close_xb_93: 0.125,
          close_xs_93: 0.23,
          close_xs_323: 0.84,
          close_xb_323: 0.73,
          close_yb_10: 0.11,
          close_ys_10: 0.30,
          close_ys_152: 0.956,
          close_yb_152: 0.816,

          far_mockup_w1: 4.5,
          far_mockup_h1: 4.5,
          far_mockup_w2: 1.9,
          far_mockup_h2: 1.9,

          close_mockup_w1: 8,
          close_mockup_h1: 6,
          close_mockup_w2: 1.4,
          close_mockup_h2: 1.4
        }
    };

    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        if (detected === false) {
          time_detected = Date.now();
        }
        // ## Far ##
        if (status === 0 || status === 2) {
          if (landmarks[93].x > coordenateData.far_xb_93 && landmarks[323].x < coordenateData.far_xs_323 &&
            landmarks[93].x < coordenateData.far_xs_93 && landmarks[323].x > coordenateData.far_xb_323 &&
            landmarks[10].y > coordenateData.far_yb_10 && landmarks[152].y < coordenateData.far_ys_152 &&
            landmarks[10].y < coordenateData.far_ys_10 && landmarks[152].y > coordenateData.far_yb_152) {
            detected = true;
            mockup.src="imagens/acertpix-face-frame-blue.png";
            if (time_detected + time_detecting < Date.now()) {
              photo1_base64 = webcamRef.current.getScreenshot({width: videoWidth, height: videoHeight});
              status = 1;
              detected = false;
              setStep(true);
            }
          } else {
            mockup.src="imagens/acertpix-face-frame-red.png";
            detected = false;
          }

          canvasCtx.drawImage(mockup, videoWidth/coordenateData.far_mockup_w1, videoHeight/coordenateData.far_mockup_h1, videoWidth/coordenateData.far_mockup_w2, videoHeight/coordenateData.far_mockup_h2);
        // ## Close ##
        } else if (status === 1) {
          if (landmarks[93].x > coordenateData.close_xb_93 && landmarks[323].x < coordenateData.close_xs_323 &&
            landmarks[93].x < coordenateData.close_xs_93 && landmarks[323].x > coordenateData.close_xb_323 &&
            landmarks[10].y > coordenateData.close_yb_10 && landmarks[152].y < coordenateData.close_ys_152 &&
            landmarks[10].y < coordenateData.close_ys_10 && landmarks[152].y > coordenateData.close_yb_152) {
            detected = true;
            mockup.src="imagens/acertpix-face-frame-blue.png";
            if (time_detected + time_detecting < Date.now()) {
              photo2_base64 = webcamRef.current.getScreenshot({width: videoWidth, height: videoHeight});
              detected = false;
              status = 42;
              capturePhoto(photo1_base64 ,photo2_base64,
                 0, 0, "situacao", "dispositivo", videoWidth, videoHeight);
            }
          } else {
            mockup.src="imagens/acertpix-face-frame-red.png";
            detected = false;
          }

          canvasCtx.drawImage(mockup, videoWidth/coordenateData.close_mockup_w1, videoHeight/coordenateData.close_mockup_h1, videoWidth/coordenateData.close_mockup_w2 , videoHeight/coordenateData.close_mockup_h2);
        }
      }
    }
    canvasCtx.restore();
  }

  

  const capturePhoto = React.useCallback(
    async (
      picture1,
      picture2,
      l,
      r,
      situacao,
      dispositivo,
      videoWidth,
      videoHeight
    ) => {
      const objeto = {
        imagemSelfie: picture1,
        imagemSelfie2: picture2,
        l: l,
        r: r,
        situacao: situacao,
        dispositivo: dispositivo,
        videoWidth: videoWidth,
        videoHeight: videoHeight,
      };
      setInfo(objeto);
      camera.current.stop();
    }
  );

  return (
    <>
      
        {!info && (
          <>
          <div className="center">
          <Webcam
            ref={webcamRef}
            facingmode = 'user'
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
              zindex: 9,
              width: "0%",
              height: "0%",
            }}
            mirrored={true}
          />
        
          {canvasRef && (
            <>
              {!stepCompleted && (
                <p className="text-center">
                  Alinhe seu rosto ao contorno indicado na tela e mantenha por x
                  segundos.
                </p>
              )}
              {stepCompleted && (
                <p className="text-center">Aproxime-se da câmera</p>
              )}
              <canvas
                ref={canvasRef}
                className="output_canvas"
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  textAlign: "center",
                  zindex: 9,
                  width: "100%",
                }}
              ></canvas>
            </>
            
          )}
          </div> 
          </>
        )}
        
        
        
          {info && (
            <>
            <div className="info mb-3">
              <h2 className="text-center">Info:</h2>
              <img alt="Imagem Selfie" src={info.imagemSelfie} id="selfie" className="mb-3"/>        
              <p><strong>Resolução Altura: </strong>{info.videoHeight}</p>
              <p><strong>Resolução Largura: </strong>{info.videoWidth}</p>
              
            </div>
              <div className="text-center">
                <button className="btn btn-primary button" onClick={refresh}> Abrir Câmera </button>
              </div>
              <></>
            </>
          )}

      
    </>
  );
};

export default CameraMediaPipe;
