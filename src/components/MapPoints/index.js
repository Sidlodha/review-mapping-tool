import React, { useEffect, useState, useRef } from "react";
import {useMutation} from "@apollo/react-hooks";
import {SAVE_IMAGE} from "../api/home";
import { Button } from "@chakra-ui/core";
// import tshirt from "../assets/preview.jpg";
import "./index.css";
let SCALE = 1;
const OFFSET_X = 0;
const OFFSET_Y = 0;
const SIZE = 500;
let imageObj;

const MapPoints = (props) => {
  const { image, load, setPicData, product_id, image_id } = props;
  let canvas = document.getElementById("my_canvas");
  imageObj = document.getElementById("image");
  const [dataUrl, setDataUrl] = useState("")
  const [save_image] = useMutation(SAVE_IMAGE, {
    onCompleted(data){
      setPicData(dataUrl)
      setSavedImg(true)
    }
  });
  const [points, setPoints] = useState([]);
  const [lastPoint, setLastPoint] = useState({});
  const [penultimatePoint, setPenultimatePoint] = useState({});
  const [toggle, setToggle] = useState(false);
  const canvasRef = useRef(null);
  const [savedImg, setSavedImg] = useState(false)

  useEffect(() => {
    canvas = document.getElementById("my_canvas");
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "deepskyblue";
    if (load) {
      if (SCALE) {
        // imageObj = new Image()
        // imageObj.src = image;
        // imageObj.width = "690px";
        let imgwidth = imageObj.offsetWidth;
        let imgheight = imageObj.offsetHeight;
        SCALE = 0;
        console.log(imageObj);
        ctx.drawImage(imageObj, 0, 0, imgwidth, imgheight, 0, 0, SIZE, SIZE);
      }
    }
    ctx.save();
    ctx.restore();
  });

  useEffect(() => {
    canvas = document.getElementById("my_canvas");
    const instaCanvas = canvas;
    let ctx = instaCanvas.getContext("2d");
    canvas.style.width = SIZE + "px";
    canvas.style.height = SIZE + "px";
    var scale = window.devicePixelRatio;
    canvas.width = Math.floor(SIZE * scale);
    canvas.height = Math.floor(SIZE * scale);
    ctx.scale(scale, scale);
    ctx.fillStyle = "deepskyblue";
    if (load) {
      if (imageObj) {
        let imgwidth = imageObj.offsetWidth;
        let imgheight = imageObj.offsetHeight;
        console.log(imgheight, imgwidth);
        ctx.drawImage(imageObj, 0, 0, imgwidth, imgheight, 0, 0, 500, 500);
      }
    }
    ctx.save();
    if (penultimatePoint) {
      ctx.beginPath();
      if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y);
      }
      for (let i = 1; i < points.length; i++) {
        ctx.fillRect(points[i].x - OFFSET_X, points[i].y - OFFSET_Y, 5, 5);
        // ctx.moveTo(points[i - 1].x - OFFSET_X, points[i - 1].y - OFFSET_Y);
        ctx.lineTo(points[i].x - OFFSET_X, points[i].y - OFFSET_Y);
      }
      if (toggle) {
        ctx.lineWidth = 2;
        ctx.fillStyle = "#8ED6FF";
        ctx.fill();
      }
      ctx.stroke();
    }

    ctx.restore();
    ctx.save();
  }, [lastPoint]);

  function getMousePos(canvas, evt) {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: evt.clientX - rect.x,
      y: evt.clientY - rect.y,
    };
  }

  const capturePoint = (evt) => {
    const mousePos = getMousePos(canvasRef, evt);
    console.log(mousePos);
    setPoints([...points, mousePos]);
    setPenultimatePoint(lastPoint);
    setLastPoint(mousePos);
  };

  const lastPointClick = () => {
    setToggle(true);
    setPoints([...points, points[0]]);
    setLastPoint(points[0]);
  };

  const deletePointClick = () => {
    const temp = points.slice(0, points.length - 1);
    setToggle(false);
    setPoints([...temp]);
    setLastPoint(points[points.length - 2]);
  };

  const saveSegmentedImage = () => {
    canvas = document.getElementById("my_canvas");
    const instaCanvas = canvas;
    let ctx = instaCanvas.getContext("2d");
    canvas.style.width = SIZE + "px";
    canvas.style.height = SIZE + "px";
    var scale = window.devicePixelRatio;
    canvas.width = Math.floor(SIZE * scale);
    canvas.height = Math.floor(SIZE * scale);
    ctx.scale(scale, scale);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,SIZE,SIZE)
    if (load) {
      if (imageObj) {
        let imgwidth = imageObj.offsetWidth;
        let imgheight = imageObj.offsetHeight;
        console.log(imgheight, imgwidth);
        ctx.drawImage(imageObj, 0, 0, imgwidth, imgheight, 0, 0, 500, 500);
      }
    }
    ctx.save();
    if (penultimatePoint) {
      ctx.beginPath();
      if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y);
      }
      for (let i = 1; i < points.length; i++) {
        ctx.fillRect(points[i].x - OFFSET_X, points[i].y - OFFSET_Y, 5, 5);
        // ctx.moveTo(points[i - 1].x - OFFSET_X, points[i - 1].y - OFFSET_Y);
        ctx.lineTo(points[i].x - OFFSET_X, points[i].y - OFFSET_Y);
      }
      if (toggle) {
        ctx.lineWidth = 2;
        ctx.fillStyle = "white";
        ctx.fill();
      }
      ctx.stroke();
    }

    // ctx.restore();
    ctx.save();
    const picURL = canvas.toDataURL()
    setDataUrl(picURL)
    
    save_image({
      variables: {
        product_id: product_id,
        image_id: image_id,
        segmented_image: picURL
      },
    });
  }

  const checkConnection = () => {
    if(points.length>2)
    if(points[0]==lastPoint){
      return <Button className="margin--10px"  onClick={saveSegmentedImage}>Save</Button>
    }
  }
  return (
    <div>
      <div className="display--flex" style={{padding: "40px 0px 40px 10px"}}>
        <img
          src={image}
          // className="frame"
          style={{ zIndex: -10 }}
          id="image"
          style={{display: "none"}}
        ></img>
        <img
          src={image}
          className="frame"
          style={{ zIndex: -1 }}
          id="image1"
          // style={{display: "none"}}
        ></img>
        <canvas
          className="frame"
          id="my_canvas"
          onClick={capturePoint}
          ref={canvasRef}
          style={{ position: "absolute" }}
        />
        <div style={{padding: "20px"}}>
          {points.length > 0 && (
            <div>
              <Button className="margin--10px" style={{ height: "40px" }} onClick={lastPointClick}>
                Connect to first point
              </Button>
            </div>
          )}
          {points.length > 0 && (
            <div>
              <Button className="margin--10px"  style={{ height: "40px" }} onClick={deletePointClick}>
                Delete last point
              </Button>
            </div>
          )}{ points.length > 0 && 
            checkConnection()
          }
          {savedImg &&
            <div>The image is saved !</div>
          }
        </div>
      </div>
    </div>
  );
};

export default MapPoints;
