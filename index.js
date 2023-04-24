
javascript:(function(){
if (!window.enabledAddons) window.enabledAddons = {};
/*
This class is an addon
*/
class Addon {
  constructor(desc, activate = (addHTML, addCSS)=>{}, disable = ()=>{}) {
    this.enableFn = activate;
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
    this.enableFn(
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
let rgbAddon = window.enabledAddons["Party Time"] || new Addon(
  {
    name: "Party Time",
    desc: "Makes the page gamer",
    allowed: ["*"],
    permanent: false,
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
);
addons.push(rgbAddon);

let subwaySurfersAddon = window.enabledAddons["Subway Surfers"] || new Addon(
  {
    name: "Subway Surfers",
    desc: "Creates a hidden iframe with Subway Surfers, press § to show.",
    allowed: ["*"],
    permanent: false,
  },
  (addHTML, addCSS) => {
    let allHTML = `
    <iframe class="subway-surfers" src="https://subway-surfer-monaco.nugeshinia.repl.co/"></iframe>
    `;
    let allCSS = `
    .subway-surfers {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
    }
    `;
    allHTML = addHTML(allHTML);
    addCSS(allCSS);
    
    window.subwaySurfersHandler = e => {
      if (e.key == "§") {
        allHTML.requestFullscreen();
      }
    }

    document.addEventListener("keydown", window.subwaySurfersHandler);
  },
  () => {
    document.removeEventListener("keydown", window.subwaySurfersHandler);
  }
);
addons.push(subwaySurfersAddon);

let fixSchoolsoftAddon = window.enabledAddons["Fix Schoolsoft"] || new Addon(
  {
    name: "Fix Schoolsoft",
    desc: "Makes schoolsoft look a bit more like the old version.",
    allowed: ["schoolsoft.se"],
    permanent: false,
  },
  (addHTML, addCSS) => {
    let allCSS = `
      .MuiDrawer-paper,
      .student-sidebar-root {
        width: 12rem !important;
      }
      .MuiTypography-root {
        font-size: 0.7rem !important;
      }
      .MuiListItemButton-root {
        padding: 0 !important;
        border-bottom: 1px dotted gray !important;
      }
    `;
    addCSS(allCSS);
  },
  () => {

  }
);
addons.push(fixSchoolsoftAddon);

let editAddon = window.enabledAddons["Edit Anything"] || new Addon(
  {
    name: "Edit Anything",
    desc: "Makes everything on the page editable.",
    allowed: ["*"],
    permanent: false,
  },
  (addHTML, addCSS) => {
    editAddon.oldSpellCheck = document.body.spellcheck;
    document.body.contentEditable = true;
    document.body.spellcheck = false;
  },
  () => {
    document.body.contentEditable = false;
    document.body.spellcheck = editAddon.oldSpellCheck;
  }
);
addons.push(editAddon);

let fullscreenAddon = window.enabledAddons["Fullscreen Pro"] || new Addon(
  {
    name: "Fullscreen Pro",
    desc: "Puts the page in a professional fullscreen mode, Escape to exit.",
    allowed: ["*"],
    permanent: false,
  },
  (addHTML, addCSS) => {
    document.body.requestFullscreen({navigationUI: "hide"});
  },
  () => {
    document.body.exitFullscreen();
  }
);
addons.push(fullscreenAddon);













/*
The main addon
*/
let mainAddon = new Addon({
  name: "Main Addon",
  desc: "This addon manages all the other addons",
  allowed: ["*"],
  permanent: false,
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
    
    z-index: 9999;
    left: 50%;
    translate: -50%;
  }

  .unimarklet {
    box-sizing: border-box;
    font-family: 'Lexend', sans-serif;
    color: white;
    font-size: 1rem;
  }

  .unimarklet.addon-grid {
    width: 90%;
    margin: auto;
    margin-top: 0.5rem;
  }
  .unimarklet.grid-item {
    display: grid;
    gap: 0 0.5rem;
    padding: 0.5rem;
    grid-template-columns: 1rem auto;

    border-top: 1px dotted gray;
  }
  .unimarklet.grid-item:nth-child(1) {
    border-top: none;
  }
  .unimarklet.grid-toggle {
    width: 1rem;
    height: 1rem;
    background: none;
    border: 1px solid gray;
    place-self: center;
  }
  .unimarklet.grid-desc {
    grid-column-start: 1;
    grid-column-end: 3;
    color: rgb(255 255 255 / 0.7);
  }
  .unimarklet.grid-toggle.active {
    background: rgb(0 255 0 / 0.2);
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
      <button class="unimarklet grid-toggle${enabledClass}"> </button>
      <div class="unimarklet grid-name">${name}</div>
      <div class="unimarklet grid-desc">${desc}</div>
    </div>
    `;
    addonHTML = createElemFromText(addonHTML, grid);

    let toggle = addonHTML.getElementsByClassName("grid-toggle")[0];
    addonHTML.addEventListener("click", e => {
      addon.toggle();
      toggle.classList.toggle("active", addon.enabled);
    });
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
  for (let i = 0; i < criteria.length; i++) {
    if (document.location.href.includes(criteria[i]) || criteria[i] == "*") {
      return true; 
    }
  }
  return false;
}



})();
