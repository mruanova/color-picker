import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import Utils from "./Utils";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  hue: number = 0;
  saturation: number = 0;
  luminance: number = 0;
  r: number = 0;
  g: number = 0;
  b: number = 0;

  ngOnInit(): void {
    let canvas: HTMLCanvasElement | null = document.getElementById('rainbow') as HTMLCanvasElement;
    let context: CanvasRenderingContext2D | null = canvas.getContext('2d', { willReadFrequently: true });
    let circle: { x: number; y: number; width: number; height: number; } = { x: 10, y: 10, width: 7, height: 7 };
    let red = document.getElementById('red');
    let green = document.getElementById('green');
    let blue = document.getElementById('blue');
    let hexadecimal = document.getElementById('hexadecimal');
    let slider = document.getElementById('slider');

    const onCanvasMouseDown = (e: MouseEvent) => {
      let currentX = e.offsetX;
      let currentY = e.offsetY;
      circle.x = currentX;
      circle.y = currentY;
      if (context) {
        let imageData = context.getImageData(circle.x, circle.y, 1, 1);
        const pickedColor = { r: imageData.data[0], g: imageData.data[1], b: imageData.data[2] };
        this.r = pickedColor.r;
        this.g = pickedColor.g;
        this.b = pickedColor.b;
        Utils.updateHexadecimalColorandRGB(pickedColor);
        const position = e.offsetY;
        const offsetHeight = canvas?.offsetHeight ?? 0;
        const percent = offsetHeight - Utils.percentageOfHeightInPixels(position, offsetHeight);
        const value = percent / 2;
        (slider as HTMLInputElement).value = value.toString();
      }
    };

    canvas.addEventListener('mousedown', onCanvasMouseDown);

    const onHexadecimalKeyUp = () => {
      if (hexadecimal && (hexadecimal as HTMLInputElement).value) {
        if ((hexadecimal as HTMLInputElement).value.length === 7) {
          if ((hexadecimal as HTMLInputElement).value.indexOf('#') === 0) {
            const rrggbb = (hexadecimal as HTMLInputElement).value.substring(1, 7);
            const regex = /^[a-zA-Z0-9]{6,}$/;
            if (regex.test(rrggbb)) {
              const color = Utils.hexToRgb((hexadecimal as HTMLInputElement).value);
              if (color) {
                (red as HTMLInputElement).value = color.r.toString();
                (green as HTMLInputElement).value = color.g.toString();
                (blue as HTMLInputElement).value = color.b.toString();
                hexadecimal.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
                (slider as HTMLInputElement).value = '0';
              }
            } else if ((hexadecimal as HTMLInputElement).value.length === 0) {
              (hexadecimal as HTMLInputElement).value = '#';
            }
          }
        }
      }
    };

    const refresh = () => {
      (hexadecimal as HTMLInputElement).style.backgroundColor = `rgb(${this.r}, ${this.g}, ${this.b})`;
      const hsl = Utils.rgb2hsl(Number(this.r), Number(this.g), Number(this.b));
      this.hue = hsl.hue;
      this.saturation = hsl.saturation;
      this.luminance = hsl.luminance;
      const x = Utils.hsl2x(300, this.hue);
      circle.x = x;
      const color = `rgb(${this.r}, ${this.g}, ${this.b})`;
      const black = "rgb(0, 0, 0)";
      const white = "rgb(255, 255, 255)";
      const backgroundImage = `linear-gradient(${white}, ${color}, ${black})`;
      (slider as HTMLInputElement).style.backgroundImage = backgroundImage;
    };

    const onRedKeyUp = () => {
      this.r = Number((red as HTMLInputElement).value);
      if (!this.r) {
        this.r = 0;
      }
      refresh();
    };

    const onGreenKeyUp = () => {
      this.g = Number((green as HTMLInputElement).value);
      if (!this.g) {
        this.g = 0;
      }
      refresh();
    };

    const onBlueKeyUp = () => {
      this.b = Number((blue as HTMLInputElement).value);
      if (!this.b) {
        this.b = 0;
      }
      refresh();
    };

    const onSliderclick = () => {
      console.log("r", this.r);
      console.log("g", this.g);
      console.log("b", this.b);
      const hsl = Utils.rgb2hsl(Number(this.r), Number(this.g), Number(this.b));
      console.log("hsl", hsl);
      this.hue = hsl.hue;
      this.saturation = hsl.saturation;
      const luminance = Number((slider as HTMLInputElement).value);
      console.log("luminance", luminance);
      this.luminance = luminance;
      const hsl2rgb = Utils.hsl2rgb(this.hue, this.saturation, this.luminance);
      console.log("hsl2rgb", hsl2rgb);
      this.r = hsl2rgb.red;
      this.g = hsl2rgb.green;
      this.b = hsl2rgb.blue;
      const pickedColor = { r: this.r, g: this.g, b: this.b };
      Utils.updateHexadecimalColorandRGB(pickedColor);
    };

    if (red) {
      red.addEventListener('input', onRedKeyUp);
    }
    if (green) {
      green.addEventListener('input', onGreenKeyUp);
    }
    if (blue) {
      blue.addEventListener('input', onBlueKeyUp);
    }
    if (hexadecimal) {
      hexadecimal.addEventListener('input', onHexadecimalKeyUp);
    }
    if (slider) {
      slider.addEventListener('click', onSliderclick);
    }

    const draw = () => {
      if (canvas && context) {
        let gradient = context.createLinearGradient(0, 0, 300, 0);
        gradient.addColorStop(0, 'rgb(255, 0, 0)');
        gradient.addColorStop(0.15, 'rgb(255, 0, 255)');
        gradient.addColorStop(0.33, 'rgb(0, 0, 255)');
        gradient.addColorStop(0.49, 'rgb(0, 255, 255)');
        gradient.addColorStop(0.67, 'rgb(0, 255, 0)');
        gradient.addColorStop(0.84, 'rgb(255, 255, 0)');
        gradient.addColorStop(1, 'rgb(255, 0, 0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 300, 150);
        gradient = context.createLinearGradient(0, 0, 0, 150);
        /*
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        */
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 300, 150);
        context.beginPath();
        context.arc(circle.x, circle.y, circle.width, 0, Math.PI * 2);
        context.strokeStyle = 'black';
        context.stroke();
        context.closePath();
      }
    };

    window.setInterval(draw, 1);
    const white = { r: 255, g: 255, b: 255 };
    Utils.updateHexadecimalColorandRGB(white);
  }
}
