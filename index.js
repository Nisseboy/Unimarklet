
javascript:(function(){
if (!window.enabledAddons) window.enabledAddons = {};
/*
This class is an addon
*/
class Addon {
  constructor(desc, activate = (addHTML, addCSS)=>{}, disable = ()=>{}) {
    this.activateFn = activate;
    this.disableFn = disable;
    this.desc = desc;

    this.addedHTML = [];
    this.addedCSS = [];

    this.enabled = false;

    if (this.desc.name == "Main Addon") {
      if (window.mainAddon && window.mainAddon.enabled) {
        window.mainAddon.disable();
      };
      window.mainAddon = this;
    } else {
      if (window.enabledAddons[this.desc.name]) {
        return false;
      }
    }
  }

  enable() {
    let temp = this;
    this.activateFn(
      (text)=>{let elem = createElemFromText(text); temp.addedHTML.push(elem); return elem;}, 
      (text)=>{let elem = createStyles(text); temp.addedCSS.push(elem); return elem;}
    );

    this.enabled = true;

    window.enabledAddons[this.desc.name] = this;
  }

  disable() {
    this.disableFn();
    
    this.addedHTML.forEach(elem => {
      elem.remove();
    });
    this.addedCSS.forEach(elem => {
      elem.remove();
    });

    this.addedHTML = [];
    this.addedCSS = [];

    this.enabled = false;

    delete window.enabledAddons[this.desc.name];
  }

  toggle() {
    if (this.enabled) this.disable();
    else this.enable();
  }
}





/*
All custom addons
*/
let addons = [];
let rgbAddon = new Addon(
  {
    name: "Party Time",
    desc: "Makes the page gamer",
    allowed: "*"
  },
  (addHTML, addCSS) => {
    let allHTML = addHTML(`
    <div class="rgb-overlay"></div>
    `);
    let allCSS = addCSS(`
    .rgb-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 10000;
    }
    `);
    rgbAddon.deg = 0;

    rgbAddon.interval = setInterval(()=>{    
      allHTML.style.backdropFilter = "hue-rotate("+rgbAddon.deg+"deg)";    
      rgbAddon.deg+=5;
    }, 10);
  },
  () => {
    clearInterval(rgbAddon.interval);
  }
)
addons.push(rgbAddon);


















/*
The main addon
*/
let mainAddon = new Addon({
  name: "Main Addon",
  desc: "This addon manages all the other addons",
  allowed: "*",
},(addHTML, addCSS)=>{
  let mainHTML = `
  <div class="unimarklet main">
    <div class="unimarklet addon-grid"></div>
    <button class="unimarklet delete">X</button>
  </div>
  `;

  let mainCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@500&display=swap');
  .unimarklet.main {

    width: 50rem;
    min-height: 10rem;
    position: fixed;
    top: 0;

    border-radius: 0 0 1rem 1rem;
    border: 2px solid gray;
    border-top: none;

    background: hsl(240, 2%, 12%);
  }

  .unimarklet {
    box-sizing: border-box;
    font-family: 'Lexend', sans-serif;
    color: white;
  }

  .unimarklet.addon-grid {
    width: 90%;
    margin: auto;
    background: red;
  }

  .unimarklet.addon-item {
    
  }

  .unimarklet.delete {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0.2rem;

    background: red;

    border: 1px solid gray;
    border-radius: 0.2rem;

    cursor: pointer;
  }
  `;
  mainHTML = addHTML(mainHTML);
  mainCSS = addCSS(mainCSS);

  mainHTML.getElementsByClassName("delete")[0].addEventListener("click", e => {
    mainAddon.disable();
  });

  let grid = mainHTML.getElementsByClassName("addon-grid")[0];
  for (let i in addons) {
    let addon = addons[i];
    let name = addon.desc.name;
    let desc = addon.desc.desc;
    let allowed = addon.desc.allowed;

    if (!isAllowed(allowed)) continue;

    let enabledClass = window.enabledAddons[name]?" active":"";

    let addonHTML = `
    <div class="unimarklet grid-item">
      <button class="unimarklet grid-toggle${enabledClass}">X</button>
      <div class="unimarklet grid-name">${name}</div>
      <div class="unimarklet grid-desc">${desc}</div>
    </div>
    `;
    addonHTML = createElemFromText(addonHTML, grid);


  }
}, ()=>{

});
mainAddon.enable();




/*
This function takes a text input and inserts it directly into the body, returns element.
*/
function createElemFromText(text, parent = document.body) {
  parent.insertAdjacentHTML("beforeend", text);

  return parent.lastElementChild;
}

/*
This function takes a text input and inserts it into a style element in the head, returns style element.
*/
function createStyles(text) {
  let stylesElem = document.createElement("style");
  stylesElem.innerText = text;
  document.head.appendChild(stylesElem);

  return stylesElem;
}

/*
Takes an allowed element ("*", "google.com") and returns true if the addon should be available
*/
function isAllowed(criteria) {
  return true;
}



})();