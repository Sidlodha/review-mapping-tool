import React from "react";
function rgbToHex(r, g, b) {
  if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
  return ((r << 16) | (g << 8) | b).toString(16);
}

function wtb(data, color = 255) {
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] <= 100) {
      data[i + 3] = 0;
    }
    if (data[i] > 100) {
      data[i] = color;
      data[i + 1] = color;
      data[i + 2] = color;
      data[i + 3] = 255;
    }
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 240,
      height: 320,
      pixels: [],
      color: 255,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.color !== this.state.color) {
      const ctx = this.canvas.getContext("2d");
      const img = new Image();
      this.canvas.style.width = 240 + "px";
      this.canvas.style.height = 320 + "px";
      this.canvas.width = Math.floor(240);
      this.canvas.height = Math.floor(320);

      img.onload = () => {
        const width = 240;
        const height = 320;

        this.setState({ width, height });

        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 240, 320);

        URL.revokeObjectURL(img.src);

        /* Read pixel data */
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        // => [r,g,b,a,...]

        let pixels = [];

        wtb(imageData.data, this.state.color);
        ctx.putImageData(imageData, 0, 0);
      };
      img.src = this.props.segmented_image;
    }
  }

  componentDidMount() {
    const ctx = this.canvas.getContext("2d");
    const img = new Image();
    this.canvas.style.width = 240 + "px";
    this.canvas.style.height = 320 + "px";
    this.canvas.width = Math.floor(240);
    this.canvas.height = Math.floor(320);

    img.onload = () => {
      const width = 240;
      const height = 320;

      this.setState({ width, height });

      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 240, 320);

      URL.revokeObjectURL(img.src);

      /* Read pixel data */
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      // => [r,g,b,a,...]

      let pixels = [];

      wtb(imageData.data);
      ctx.putImageData(imageData, 0, 0);
    };
    img.src = this.props.segmented_image;
  }
  render() {
    const { width, height } = this.state;

    return (
      <div style={{display: 'flex', flexDirection: "column"}}>
        <canvas
          ref={(el) => (this.canvas = el)}
          style={{ position: "absolute" }}
        />

        <img
          src={this.props.image}
          width="240px"
          height="320px"
          style={{ position: "relative", zIndex: -2 }}
        />
        <button
          onClick={() => {
            this.setState({ color: this.state.color == 255 ? 0 : 255 });
          }}
        >
          Convert color to {this.state.color==255?"black":"white"}
        </button>
      </div>
    );
  }
}
