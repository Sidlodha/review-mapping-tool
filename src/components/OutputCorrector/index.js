import React, { useEffect, useState, useRef } from "react";
import ModelPrediction from "./newModel";
import MapPoints from "../MapPoints";
import MultipleMapPoints from "../MultipleMapPoints";
import "./index.css";

const App = (props) => {
  const {
    image,
    load,
    isOccluded,
    pred_decider,
    setPicData,
    product_id,
    image_id,
    extraPic,
    canvas_name,
    new_image
  } = props;
  const [predImg, setPredImg] = useState(image);
  const [predImgExtra, setPredImgExtra] = useState(image);
  useEffect(() => {
    if (isOccluded !== "") {
      const output = fetch(
        `http://35.223.58.80:5000/output?image_url=${image}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.blob())
        .then((res) => {
          let reader = new FileReader();
          let base64data;
          reader.readAsDataURL(res);
          reader.onloadend = function () {
            base64data = reader.result;
            setPredImg(base64data);
          };
          let object =
            // base64data
            URL.createObjectURL(res);
          // setPredImg(object);
        })
        .catch((res) => console.error("Did not recieve any prediction"));
         fetch(
          `http://35.223.58.80:5000/output2?image_url=${image}`,
          {
            method: "GET",
          }
        )
          .then((res) => res.blob())
          .then((res) => {
            let reader = new FileReader();
            let base64data;
            reader.readAsDataURL(res);
            reader.onloadend = function () {
              base64data = reader.result;
              setPredImgExtra(base64data);
            };
          })
          .catch((res) => console.error("Did not recieve any prediction for back"));
    }
  }, [isOccluded]);
  useEffect(() => {
    if (isOccluded !== "") {
      if (pred_decider == "No") {
      }
    }
  }, [isOccluded, pred_decider]);
  const checkPredDecider = () => {
    if (extraPic) {
      if (pred_decider !== "No") {
        return (
          <ModelPrediction
            image={predImgExtra}
            pred_decider={pred_decider}
            setPicData={setPicData}
            product_id={product_id}
            image_id={image_id}
            canvas_name = {canvas_name}
            extraPic={extraPic}
            extraModelPic
          />
        );
      } else {
        return (
          <MultipleMapPoints
            image={new_image}
            load={false}
            setPicData={setPicData}
            product_id={product_id}
            image_id={image_id}
            canvas_name = {canvas_name}
            extraPic={extraPic}
          />
        );
      }
    }
    if (pred_decider !== "No") {
      return (
        <ModelPrediction
          image={predImg}
          pred_decider={pred_decider}
          setPicData={setPicData}
          product_id={product_id}
          image_id={image_id}
          canvas_name = {canvas_name}
          extraPic={extraPic}
        />
      );
    } else {
      return (
        <MultipleMapPoints
          image={new_image}
          load={false}
          setPicData={setPicData}
          product_id={product_id}
          image_id={image_id}
          canvas_name = {canvas_name}
          extraPic={extraPic}
        />
      );
    }
  };
  return <div>{isOccluded!== "" && checkPredDecider()}</div>;
};

export default App;

// import tshirt from "../assets/tshirt400.jpg";
// import "./index.css";
// let SCALE = 1;
// const OFFSET_X = 0;
// const OFFSET_Y = 0;
// let imageObj;
// let SIZE = 500;

// const App = (props) => {
//   const { image, load } = props;
//   let canvas2 = document.getElementById("output_canvas");
//   imageObj = document.getElementById("output");
//   // let timer;

//   const [points, setPoints] = useState([]);
//   const [lastPoint, setLastPoint] = useState({});
//   const [penultimatePoint, setPenultimatePoint] = useState({});
//   const [toggle, setToggle] = useState(false);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     canvas2 = document.getElementById("output_canvas");
//     // imageObj = document.getElementById("output")
//     const ctx2 = canvas2.getContext("2d");
//     ctx2.fillStyle = "deepskyblue";

//     if (load) {
//       if (SCALE) {
//         let imgwidth = imageObj.offsetWidth;
//         let imgheight = imageObj.offsetHeight;
//         SCALE = 0;
//         console.log(imageObj);
//         ctx2.drawImage(imageObj, 0, 0, imgwidth, imgheight, 0, 0, SIZE, SIZE);
//       }
//     }
//     ctx2.save();
//     ctx2.restore();
//   });

//   useEffect(() => {
//     canvas2 = document.getElementById("output_canvas");
//     const instaCanvas = canvas2;
//     let ctx = instaCanvas.getContext("2d");
//     canvas2.style.width = SIZE + "px";
//     canvas2.style.height = SIZE + "px";
//     var scale = window.devicePixelRatio;
//     canvas2.width = Math.floor(SIZE * scale);
//     canvas2.height = Math.floor(SIZE * scale);
//     ctx.scale(scale, scale);
//     ctx.fillStyle = "black";
//     if (load) {
//       let imgwidth = imageObj.offsetWidth;
//       let imgheight = imageObj.offsetHeight;
//       console.log(imgheight, imgwidth);
//       ctx.drawImage(imageObj, 0, 0, imgwidth, imgheight, 0, 0, 500, 500);
//     }
//     ctx.save();
//     for (let i = 0; i < points.length; i++) {
//       ctx.fillRect(points[i].x - 5, points[i].y - 5, 10, 10);
//     }
//     ctx.save();
//     // ctx.restore()
//   }, [lastPoint]);

//   function getMousePos(canvas, evt) {
//     const rect = canvasRef.current.getBoundingClientRect();
//     return {
//       x: evt.clientX - rect.x,
//       y: evt.clientY - rect.y,
//     };
//   }

//   const capturePoint = (evt) => {
//     const mousePos = getMousePos(canvasRef, evt);
//     console.log(mousePos);
//     setPoints([...points, mousePos]);
//     setPenultimatePoint(lastPoint);
//     setLastPoint(mousePos);
//   };

//   // const capturePointNew = (evt) => {
//   //   timer = window.setTimeout(() => {
//   //     console.log('starts')
//   //     const mousePos = getMousePos(canvasRef, evt);
//   //     console.log(mousePos);
//   //     setPoints([...points, mousePos]);
//   //     setPenultimatePoint(lastPoint);
//   //     setLastPoint(mousePos);
//   //   }, 10);
//   // };

//   // const onMouseUp = (evt) => {
//   //   clearTimeout(timer);
//   // };

//   const lastPointClick = () => {
//     setToggle(true);
//     setPoints([...points, points[0]]);
//     setLastPoint(points[0]);
//   };

//   const deletePointClick = () => {
//     const temp = points.slice(0, points.length - 1);
//     setToggle(false);
//     setPoints([...temp]);
//     setLastPoint(points[points.length - 2]);
//   };

//   return (
//     <div>
//       <div className="display--flex-nowrap" style={{ padding: "40px 10px" }}>
//         <img
//           src={image}
//           // className="frameOutput"
//           style={{ zIndex: -10 }}
//           style={{ display: "none" }}
//           id="output"
//         ></img>
//         <img
//           src={image}
//           className="frameOutput"
//           style={{ zIndex: -1 }}
//           id="output-1"
//         ></img>
//         {/*
//         <canvas
//           className="frame"
//           id="my_canvas"
//           onClick={capturePoint}
//           ref={canvasRef}
//           style={{ position: "absolute" }}
//         /> */}
//         <canvas
//           className="frameOutput"
//           id="output_canvas"
//           onClick={capturePoint}
//           // onMouseDown={capturePointNew}
//           // onMouseUp={onMouseUp}
//           ref={canvasRef}
//           style={{ position: "absolute" }}
//         />
//         <div>
//           <div>
//             <button style={{ height: "40px" }}>
//               Save Image
//             </button>
//           </div>

//           {points.length > 0 && (
//             <div>
//               <button style={{ height: "40px" }} onClick={deletePointClick}>
//                 Delete last point
//               </button>
//             </div>
//           )}
//           {/* {toggle &&
//         <button style={{height: '40px'}} onClick={addColor}>D</button>
//         } */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;
