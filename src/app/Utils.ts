export default class Utils {
    static componentToHex = (c: { toString: (arg0: number) => any; }) => {
        var hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    };

    static rgbToHex = (r: { toString: (arg0: number) => any; }, g: { toString: (arg0: number) => any; }, b: { toString: (arg0: number) => any; }): string => {
        return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    };

    static hexToRgb = (hex: string) => {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    static updateHexadecimalColorandRGB = (color: { r: any; g: any; b: any; }) => {
        let hexadecimal = document.getElementById('hexadecimal');
        if (hexadecimal) {
            hexadecimal.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
            (hexadecimal as HTMLInputElement).value = this.rgbToHex(color.r, color.g, color.b);
            let red = document.getElementById('red');
            if (red) {
                (red as HTMLInputElement).value = color.r;
            }
            let green = document.getElementById('green');
            if (green) {
                (green as HTMLInputElement).value = color.g;
            }
            let blue = document.getElementById('blue');
            if (blue) {
                (blue as HTMLInputElement).value = color.b;
            }
        }
    };

    static rgb2hsl = (red: number, green: number, blue: number): any => {
        const r = red / 255;
        const g = green / 255;
        const b = blue / 255;
        let rr = 0;
        let gg = 0;
        let bb = 0;
        let h = 0;
        let s = 0;
        const v = Math.max(r, g, b);
        const diff = v - Math.min(r, g, b);
        const diffc = (c: number) => (v - c) / 6 / diff + 1 / 2;
        if (diff === 0) {
            h = s = 0;
        } else {
            s = diff / v;
            rr = diffc(r);
            gg = diffc(g);
            bb = diffc(b);
            if (r === v) { h = bb - gg }
            else if (g === v) { h = (1 / 3) + rr - bb }
            else if (b === v) { h = (2 / 3) + gg - rr }
            if (h < 0) { h += 1 }
            else if (h > 1) { h -= 1 }
        }
        return {
            hue: Math.round(h * 360),
            saturation: Math.round(s * 100),
            luminance: Math.round(v * 100)
        };
    };

    static hsl2rgb = (hue: number, saturation: number, luminance: number): any => {
        const rgb = { red: 0, green: 0, blue: 0 };
        let h = Math.round(hue);
        const s = Math.round(saturation * 255 / 100);
        const v = Math.round(luminance * 255 / 100);
        if (s === 0) {
            rgb.red = rgb.green = rgb.blue = v;
        }
        else {
            const t1 = v;
            const t2 = (255 - s) * v / 255;
            const t3 = (t1 - t2) * (h % 60) / 60;
            if (h === 360) h = 0;
            if (h < 60) { rgb.red = t1; rgb.blue = t2; rgb.green = t2 + t3; }
            else if (h < 120) { rgb.green = t1; rgb.blue = t2; rgb.red = t1 - t3; }
            else if (h < 180) { rgb.green = t1; rgb.red = t2; rgb.blue = t2 + t3; }
            else if (h < 240) { rgb.blue = t1; rgb.red = t2; rgb.green = t1 - t3; }
            else if (h < 300) { rgb.blue = t1; rgb.green = t2; rgb.red = t2 + t3; }
            else if (h < 360) { rgb.red = t1; rgb.green = t2; rgb.blue = t1 - t3; }
            else { rgb.red = 0; rgb.green = 0; rgb.blue = 0; }
        }
        return {
            red: Math.round(rgb.red),
            green: Math.round(rgb.green),
            blue: Math.round(rgb.blue)
        };
    };

    static hsl2x = (width: number, hue: number): any => {
        const x = Math.round(width / 360 * hue);
        return x;
    };

    static percentageOfHeightInPixels = (position: number, height: number): any => {
        const result = (position / height) * 100;
        return Math.round(result);
    };

}