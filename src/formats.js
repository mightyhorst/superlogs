class Formats {
  randomColor() {
    const randomRange = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
    return randomRange(0, 255);
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
      color: #fff; 
      background-color:${color}; 
      font-weight: ${isBold ? 'bold' : 'normal'}; 
      font-style: ${isItalic ? 'italic' : 'none'}
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
  then() {
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
  catch(){
    return this.error();
  }
  loop() {
    return `
      background: #fff; 
      color: rgba(0,0,0,.7); 
      font-weight: 'normal'; 
      font-style: 'italic';
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
}
module.exports = {
  formats: () => {
    return new Formats();
  }
}