import React, { useEffect, useState, useRef } from "react";
import { useMutation } from "@apollo/react-hooks";
import { SAVE_IMAGE, SAVE_EXTRA_IMAGE } from "../api/home";
import { Button } from "@chakra-ui/core";
// import tshirt from "../assets/preview.jpg";
import "./index.css";
let SCALE = 1;
const OFFSET_X = 0;
const OFFSET_Y = 0;
// const SIZE = 500;
const SIZEX = 384;
const SIZEY = 512;
let imageObj;

const MapPoints = (props) => {
  const { image, load, setPicData, product_id, image_id, extraPic, canvas_name } = props;
  let canvas = document.getElementById(canvas_name);
  imageObj = document.getElementById("image");
  const [dataUrl, setDataUrl] = useState("");
  const [save_image] = useMutation(SAVE_IMAGE, {
    onCompleted(data) {
      setPicData(dataUrl);
      setSavedImg(true);
    },
  });
  const [save_extra_image] = useMutation(SAVE_EXTRA_IMAGE, {
    onCompleted(data) {
      setPicData(dataUrl);
      setSavedImg(true);
    },
  });
  const [points, setPoints] = useState([[]]);
  const [lastPoint, setLastPoint] = useState({});
  const [penultimatePoint, setPenultimatePoint] = useState({});
  const [toggle, setToggle] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const canvasRef = useRef(null);
  const [savedImg, setSavedImg] = useState(false);

  useEffect(() => {
    canvas = document.getElementById(canvas_name);
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
        ctx.drawImage(imageObj, 0, 0, imgwidth, imgheight, 0, 0, SIZEX, SIZEY);
      }
    }
    ctx.save();
    ctx.restore();
  });

  useEffect(() => {
    canvas = document.getElementById(canvas_name);
    const instaCanvas = canvas;
    let ctx = instaCanvas.getContext("2d");
    canvas.style.width = SIZEX + "px";
    canvas.style.height = SIZEY + "px";
    var scale = window.devicePixelRatio;
    canvas.width = Math.floor(SIZEX * scale);
    canvas.height = Math.floor(SIZEY * scale);
    ctx.scale(scale, scale);
    ctx.fillStyle = "deepskyblue";
    if (load) {
      if (imageObj) {
        let imgwidth = imageObj.offsetWidth;
        let imgheight = imageObj.offsetHeight;
        ctx.drawImage(imageObj, 0, 0, imgwidth, imgheight, 0, 0, SIZEX, SIZEY);
      }
    }
    ctx.save();
    if (activeIndex > 0) {
      ctx.beginPath();
      for (let j = 0; j < points.length - 1; j++) {
        if (points[j].length > 0) {
          ctx.moveTo(points[j][0].x, points[j][0].y);
        }
        for (let i = 1; i < points[j].length; i++) {
          ctx.fillRect(
            points[j][i].x - OFFSET_X,
            points[j][i].y - OFFSET_Y,
            5,
            5
          );
          // ctx.moveTo(points[i - 1].x - OFFSET_X, points[i - 1].y - OFFSET_Y);
          ctx.lineTo(points[j][i].x - OFFSET_X, points[j][i].y - OFFSET_Y);
        }
        ctx.lineWidth = 2;
        ctx.fillStyle = "#8ED6FF";
        ctx.fill();
        ctx.stroke();
      }
      ctx.save()
    }
    if (penultimatePoint) {
      ctx.beginPath();
      if (points[activeIndex].length > 0) {
        ctx.moveTo(points[0].x, points[0].y);
        ctx.fillRect(
          points[activeIndex][0].x - OFFSET_X,
          points[activeIndex][0].y - OFFSET_Y,
          5,
          5
        ) 
      }
      for (let i = 0; i < points[activeIndex].length; i++) {
        ctx.fillRect(
          points[activeIndex][i].x - OFFSET_X,
          points[activeIndex][i].y - OFFSET_Y,
          5,
          5
        );
        // ctx.moveTo(points[i - 1].x - OFFSET_X, points[i - 1].y - OFFSET_Y);
        ctx.lineTo(
          points[activeIndex][i].x - OFFSET_X,
          points[activeIndex][i].y - OFFSET_Y
        );
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
    const temp = points;
    temp[activeIndex].push(mousePos);
    setPoints(temp);
    setPenultimatePoint(lastPoint);
    setLastPoint(mousePos);
  };

  const lastPointClick = () => {
    setToggle(true);
    const temp = points
    let tempPoints = points[activeIndex]
    tempPoints =  [...tempPoints, tempPoints[0]]
    temp[activeIndex] = tempPoints
    setPoints(temp);
    setLastPoint(points[activeIndex][0]);
  };

  const deletePointClick = () => {
    const temp = points
    if(points[activeIndex].length===1){
      if(activeIndex>0){
        const temp = points.slice(0, points.length - 1)
        setToggle(false)
        setPoints([...temp])
        setLastPoint(points[activeIndex-1][points[activeIndex-1].length - 1])
        setActiveIndex(activeIndex-1)
      }
      else{
        setActiveIndex(0)
        setPoints([[]])
        setToggle(false)
        setLastPoint({})
      }

    }
    else{
    const tempPoints = points[activeIndex].slice(0, points[activeIndex].length - 1);
    temp[activeIndex] = tempPoints
    setToggle(false);
    setPoints([...temp]);
    setLastPoint(points[activeIndex][points[activeIndex].length - 2]);}
  };

  const saveSegmentedImage = () => {
    canvas = document.getElementById(canvas_name);
    const instaCanvas = canvas;
    let ctx = instaCanvas.getContext("2d");
    canvas.style.width = SIZEX + "px";
    canvas.style.height = SIZEY + "px";
    var scale = window.devicePixelRatio;
    canvas.width = Math.floor(SIZEX * scale);
    canvas.height = Math.floor(SIZEY * scale);
    ctx.scale(scale, scale);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, SIZEX, SIZEY);
    if (load) {
      if (imageObj) {
        let imgwidth = imageObj.offsetWidth;
        let imgheight = imageObj.offsetHeight;
        ctx.drawImage(imageObj, 0, 0, imgwidth, imgheight, 0, 0, SIZEX, SIZEY);
      }
    }
    ctx.save();
    if (activeIndex >= 0) {
      ctx.beginPath();
      for (let j = 0; j < points.length; j++) {
        if (points[j].length > 0) {
          ctx.moveTo(points[j][0].x, points[j][0].y);
        }
        for (let i = 1; i < points[j].length; i++) {
          // ctx.moveTo(points[i - 1].x - OFFSET_X, points[i - 1].y - OFFSET_Y);
          ctx.lineTo(points[j][i].x - OFFSET_X, points[j][i].y - OFFSET_Y);
        }
        ctx.lineWidth = 2;
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();
      }
    }
    // if (penultimatePoint) {
    //   ctx.beginPath();
    //   if (points[activeIndex].length > 0) {
    //     ctx.moveTo(points[activeIndex][0].x, points[0].y);
    //   }
    //   for (let i = 1; i < points.length; i++) {
    //     ctx.fillRect(points[activeIndex][i].x - OFFSET_X, points[activeIndex][i].y - OFFSET_Y, 5, 5);
    //     // ctx.moveTo(points[i - 1].x - OFFSET_X, points[i - 1].y - OFFSET_Y);
    //     ctx.lineTo(points[activeIndex][i].x - OFFSET_X, points[activeIndex][i].y - OFFSET_Y);
    //   }
    //   if (toggle) {
    //     ctx.lineWidth = 2;
    //     ctx.fillStyle = "white";
    //     ctx.fill();
    //   }
    //   ctx.stroke();
    // }

    // ctx.restore();
    ctx.save();
    const picURL = canvas.toDataURL();
    setDataUrl(picURL);
    if(extraPic){
      console.log('enters')
      save_extra_image({
        variables: {
          product_id: product_id,
          image_id: image_id,
          segmented_image_back: picURL,
        },
      });
    }
    else{
    save_image({
      variables: {
        product_id: product_id,
        image_id: image_id,
        segmented_image: picURL,
      },
    });
  }
  };

  const checkConnection = () => {
    if (points[activeIndex].length > 2)
      if (points[activeIndex][0] == lastPoint) {
        return (
          <Button className="margin--10px" onClick={saveSegmentedImage}>
            Save
          </Button>
        );
      }
  };

  const addAnotherPath = () => {
    const temp = points;
    temp.push([]);
    setActiveIndex(activeIndex + 1);
    setPenultimatePoint({})
    setLastPoint({})
    setPoints(temp);
    setToggle(false)
  };
  return (
    <div>
      <div className="display--flex" style={{ padding: "40px 0px 40px 10px" }}>
        <img
          src={image}
          // className="frame"
          style={{ zIndex: -10 }}
          id="image"
          style={{ display: "none" }}
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
          id={canvas_name}
          onClick={capturePoint}
          ref={canvasRef}
          style={{ position: "absolute", border: "1px solid" }}
        />
        <div style={{ padding: "20px" }}>
          {points[activeIndex].length > 0 && (
            <div>
              <Button
                className="margin--10px"
                style={{ height: "40px" }}
                onClick={lastPointClick}
              >
                Connect to first point
              </Button>
            </div>
          )}
          {points[activeIndex].length > 0 && (
            <div>
              <Button
                className="margin--10px"
                style={{ height: "40px" }}
                onClick={deletePointClick}
              >
                Delete last point
              </Button>
            </div>
          )}
          {points[activeIndex].length > 0 && checkConnection()}
          {savedImg && <div>The image is saved !</div>}
          <Button onClick={addAnotherPath}>Add another Area</Button>
        </div>
      </div>
    </div>
  );
};

export default MapPoints;
