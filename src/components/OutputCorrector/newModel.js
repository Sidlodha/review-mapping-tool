import React, { useRef, useLayoutEffect, useState } from "react";
import { Stage, Layer, Image, Rect, Path, Line } from "react-konva";
import {useMutation} from "@apollo/react-hooks";
import {SAVE_IMAGE, SAVE_EXTRA_IMAGE} from "../api/home"
import { Button } from "@chakra-ui/core";
import './index.css';


const ModelOutput = (props) => {
  const { image, pred_decider, setPicData, product_id, image_id, extraModelPic } = props;
  const stageRef = useRef();
  const canvasReff = useRef();
  const [points, setPoints] = useState([]);
  const [lastPoint, setLastPoint] = useState({});
  const [penultimatePoint, setPenultimatePoint] = useState({});
  const [pathPoints, setPathPoints] = useState([])
  const [saved, setSaved] = useState(false)
  const [save_image] = useMutation(SAVE_IMAGE,{
    onCompleted(data){
      setPicData(stageRef.current.toDataURL())
      setSaved(true)
    }
  });
  const [save_extra_image] = useMutation(SAVE_EXTRA_IMAGE,{
    onCompleted(data){
      setPicData(stageRef.current.toDataURL())
      setSaved(true)
    }
  });
  

  const handleSaveImage = (event) => {
    event.preventDefault();
    const dataURL = stageRef.current.toDataURL();
    console.log(dataURL)
    if(extraModelPic){
      save_extra_image({
        variables: {
          product_id: product_id,
          image_id: image_id,
          segmented_image_back: dataURL
        },
      });
    }
    else{
    save_image({
        variables: {
          product_id: product_id,
          image_id: image_id,
          segmented_image: dataURL
        },
      });
    }
  };

  const capturePoint = (evt) => {
    const mousePos = getMousePos(stageRef, evt);
    if (pred_decider == "Yes Mod") {
      if(points.length%2==1){
      if(lastPoint){
        console.log('enters')
        console.log(lastPoint)
        console.log(mousePos)
        let width = Math.abs(lastPoint.x - mousePos.x)
        let height = Math.abs(lastPoint.y - mousePos.y)
        let x = mousePos.x
        let y = mousePos.y
        if(lastPoint.x<mousePos.x){
          x = lastPoint.x
        }
        if(lastPoint.y<mousePos.y){
          y = lastPoint.y
        }
        let newObj = {x, y, width, height}
        setPathPoints([...pathPoints,newObj])
      }}
      setPoints([...points, mousePos]);
      setPenultimatePoint(lastPoint);
      setLastPoint(mousePos);
    }
  };

  function getMousePos(canvas, evt) {
    const rect = canvasReff.current.getBoundingClientRect();
    return {
      x: evt.clientX - rect.x,
      y: evt.clientY - rect.y,
    };
  }

  const deleteLastPoint = () => {
    console.log(points.length);
    if(points.length%2==0 && points.length!==0){
      if(pathPoints){
      const tempPath = pathPoints.slice(0, pathPoints.length - 1);
      console.log(tempPath)
      setPathPoints([...tempPath])}
    }
    const temp = points.slice(0, points.length - 1);
    setLastPoint(temp[temp.length - 1]);
    setPoints([...temp]);
  };

  return (
    <div style={{padding: "40px 10px 40px 10px"}}>
      <div ref={canvasReff} onClick={capturePoint} >
        <Stage width={384} height={512} ref={stageRef} style={{border: "1px solid"}}>
          <Layer>
            <URLImage src={image} x={0} />
            {points && points.map((point) => (
              <Rect
                x={point.x-2}
                y={point.y-2}
                width={2}
                height={2}
                fill="black"
              />
            ))}
            {pathPoints.map((point)=>
            <Rect
            x={point.x}
            y={point.y}
            width={point.width}
            height={point.height}
            fill="black"
            />
            )} 
          </Layer>
        </Stage>
      </div>
      <Button className="margin--10px" onClick={handleSaveImage}>Save Image</Button>
      {points.length > 0 && (
        <Button className="margin--10px" onClick={deleteLastPoint}>Delete Last point</Button>
      )}
      {saved && <div>The image is stored!</div>}
    </div>
  );
};

export default ModelOutput;



class URLImage extends React.Component {
  state = {
    image: null,
  };
  componentDidMount() {
    this.loadImage();
  }
  componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src) {
      this.loadImage();
    }
  }
  componentWillUnmount() {
    this.image.removeEventListener("load", this.handleLoad);
  }
  loadImage() {
    // save to "this" to remove "load" handler on unmount
    this.image = new window.Image();
    this.image.src = this.props.src;
    this.image.addEventListener("load", this.handleLoad);
  }
  handleLoad = () => {
    this.setState({
      image: this.image,
    });
  };
  render() {
    return (
      <Image
        x={this.props.x}
        y={this.props.y}
        image={this.state.image}
        ref={(node) => {
          this.imageNode = node;
        }}
        width={384}
        height={512}
      />
    );
  }
}