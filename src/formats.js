class Formats {
    randomIntFromInterval(min, max) { 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    randomColor() {
        return this.randomIntFromInterval(0, 255);
    }
    getColor() {
        let currentColor = `rgb(${this.randomColor()}, ${this.randomColor()}, ${this.randomColor()})`;;
        return currentColor;
    }
    method(color, isBold) {
        return `
          background: ${color}; 
          color:white; 
          padding: 2px; 
          border: 1px solid rgba(0,0,0,.1); 
          border-radius: 2px; 
          font-weight: ${isBold ? 'bold' : 'normal'}
        `;
    }
    step(color, isBold, isItalic) {
        return `
          background: #fff; 
          color:${color}; 
          font-weight: ${isBold ? 'bold' : 'normal'}; 
          font-style: ${isItalic ? 'italic' : 'none'}
        `;
    }
    clear(isBold, isItalic) {
        return `
          background: #fff; 
          color:#000; 
          font-weight: ${isBold ? 'bold' : 'normal'}; 
          font-style: ${isItalic ? 'italic' : 'none'};
        `;
    }
    check() {
        return `
          background: #fff; 
          color: rgba(0,0,0,.7); 
          font-weight: 'normal'; 
          font-style: 'italic';
        `;
    }
    goTo() {
        return `
          background: #fff; 
          color: rgba(0,0,0,.7); 
          font-weight: 'normal'; 
          font-style: 'italic';
        `;
    }
    if() {
        return `
          background: #fff; 
          color: rgba(0,0,0,.7); 
          font-weight: 'normal'; 
          font-style: 'italic';
        `;
    }
    error(isBold, isItalic) {
        return `
          background: #fff; 
          color:rgba(200,0,0,1); 
          font-weight: ${isBold ? 'bold' : 'normal'}; 
          font-style: ${isItalic ? 'italic' : 'none'};
        `;
    }
}
module.exports = {
    formats: () => {
        return new Formats();
    }
}