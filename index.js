
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
      z-index: 1000000;
      
      animation: ichliebebananasomnomnomnomnom 1s infinite linear;
    }

    @keyframes ichliebebananasomnomnomnomnom {
      0% {
        backdrop-filter: hue-rotate(0deg);
      }
      100% {
        backdrop-filter: hue-rotate(360deg);
      }
    }
    `);
  },
  () => {
    
  }
);
addons.push(rgbAddon);

let gamesMenu = {
  desc: {
    name: "Games",
    desc: "Collection of games",
    allowed: ["*"],
  },
  addons: [],
};
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
gamesMenu.addons.push(subwaySurfersAddon);
addons.push(gamesMenu);

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
    desc: "Puts the page in a professional fullscreen mode, Escape to exit. This is not a toggle.",
    allowed: ["*"],
    permanent: false,
  },
  (addHTML, addCSS) => {
    document.body.requestFullscreen({navigationUI: "hide"});
    fullscreenAddon.disable();
  },
  () => {
    
  }
);
addons.push(fullscreenAddon);

let reverseTextAddon = window.enabledAddons["Reverse Text"] || new Addon(
  {
    name: "Reverse Text",
    desc: "Reverses all the words on the page",
    allowed: "*",
    permanent: false,
  },
  (addHTML, addCSS) => {
    reverseTextAddon.elems = document.querySelectorAll("*");
    for (let i = 0; i < reverseTextAddon.elems.length; i++) {
      let elem = reverseTextAddon.elems[i];
      if (elem.innerText && elem.childElementCount == 0)
      elem.innerText = elem.innerText.split("").reverse().join("");
    }
  },
  () => {
    for (let i = 0; i < reverseTextAddon.elems.length; i++) {
      let elem = reverseTextAddon.elems[i];
      if (elem.innerText && elem.childElementCount == 0)
      elem.innerText = elem.innerText.split("").reverse().join("");
    }
  }
);
addons.push(reverseTextAddon);

let erikAddon = window.enabledAddons["Erik Mode"] || new Addon(
  {
    name: "Erik Mode",
    desc: "Enables Erik mode. (Sound on)",
    allowed: "*",
    permanent: false,
  },
  (addHTML, addCSS) => {
    let elem = addHTML("<div></div>");

    let audios = [];
    let audioPtr = {a:0};
    for (let i = 0; i < 10; i++) {
      let a = document.createElement("audio");
      a.src = "https://notification-sounds.com/soundsfiles/Goat-noise.mp3";
      elem.appendChild(a);

      audios.push(a);
    }
    
    erikAddon.func = () => {
      let a = audios[audioPtr.a];
      a.currentTime = 0;
      a.play();
      audioPtr.a = (audioPtr.a + 1) % audios.length;
    }
    erikAddon.func();

    document.addEventListener("keydown", erikAddon.func);
  },
  ()=>{
    document.removeEventListener("keydown", erikAddon.func);
  }
);
addons.push(erikAddon);


let ccMenu = {
  desc: {
    name: "Cookie Clicker",
    desc: "Collection of addons for Cookie Clicker",
    allowed: ["orteil.dashnet.org/cookieclicker"],
  },
  addons: [],
};
let cookieMonsterAddon = window.enabledAddons["Cookie Monster"] || new Addon(
  {
    name: "Cookie Monster",
    desc: "Activates the cookie monster mod",
    allowed: ["*"],
    permanent: true,
  },
  (addHTML, addCSS) => {
    Game.LoadMod("https://cookiemonsterteam.github.io/CookieMonster/dist/CookieMonster.js");
  },
  () => {
    
  }
);
ccMenu.addons.push(cookieMonsterAddon);
addons.push(ccMenu);











/*
The main addon
*/
let mainAddon = new Addon({
  name: "Main Addon",
  desc: "This addon manages all the other addons",
  allowed: ["*"],
  permanent: false,
},(addHTML, addCSS)=>{
  if (!mainAddon.addonPath) mainAddon.addonPath = [];

  let returnText = (mainAddon.addonPath.length > 0)?`<button class="unimarklet return"><</button>`:"";
  let mainHTML = `
  <div class="unimarklet main">
    ${returnText}
    <div class="unimarklet addon-grid"></div>
    <button class="unimarklet delete">X</button>
  </div>
  `;

  let mainCSS = `
  .unimarklet.main {

    width: 50rem;
    position: fixed;
    top: 0;

    border-radius: 0 0 1rem 1rem;
    
    z-index: 9999999;
    left: 50%;
    translate: -50%;

    overflow: hidden;
  }
  .unimarklet.main::before {
    content: "";
    background-image: conic-gradient(yellow, orange, red, purple, blue, green, yellow);
    position: absolute;
    inset: -100vw;

    animation: spin 1s infinite;
    z-index: -2;
  }
  .unimarklet.main::after {
    content: "";
    background: hsl(240, 2%, 12%);
    position: absolute;
    inset: 0.2rem;
    top: 0;
    border-radius: inherit;

    z-index: -1;
  }

  @keyframes spin {
    0% {
      rotate: 0deg;
    }
    100% {
      rotate: 360deg;
    }
  }

  .unimarklet {
    box-sizing: border-box;
    font-family: sans-serif;
    color: white;
    font-size: 1rem;
  }

  .unimarklet.addon-grid {
    width: calc(100% - 2rem);
    padding-bottom: 1rem;
    margin: auto;
    margin-top: 0.5rem;
  }
  .unimarklet.grid-item {
    display: grid;
    gap: 0 0.5rem;
    padding: 0.5rem;
    grid-template-columns: 1rem auto;

    border-top: 1px dotted gray;
    cursor: pointer;

    position: relative;
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
  .unimarklet.grid-enter {
    padding: 0;
    background: none;
    display: grid;
    border: none;
  }
  .unimarklet.grid-permanent {
    color: hsl(0, 50%, 50%);
    margin-left: 1ch;
  }

  .unimarklet.return {
    position: absolute;
    background: none;
    cursor: pointer;
    border: none;
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
  mainHTML.getElementsByClassName("return")[0]?.addEventListener("click", e => {
    mainAddon.addonPath.splice(-1, 1);
    mainAddon.disable(); 
    mainAddon.enable();
  });

  let tempAddons = addons;
  
  for (let i = 0; i < mainAddon.addonPath.length; i++) {
    let path = mainAddon.addonPath[i];
    tempAddons = tempAddons[path].addons;
  }

  let grid = mainHTML.getElementsByClassName("addon-grid")[0];
  grid.replaceChildren();
  for (let i in tempAddons) {
    createAddonElem(tempAddons[i], i, grid);
  }
}, ()=>{

});
mainAddon.enable();


/*
This function takes an addon and creates and appends an element to specfied parent
*/
function createAddonElem(addon, i, parent) {
  let isMenu = !!addon.addons;

  let name = addon.desc.name;
  let desc = addon.desc.desc;
  let allowed = addon.desc.allowed;
  let permanent = addon.desc.permanent;

  if (!isAllowed(allowed)) return;

  let enabledClass = window.enabledAddons[name]?" active":"";
  let toggleText = !isMenu?`<button class="unimarklet grid-toggle${enabledClass}"> </button>`:`<button class="unimarklet grid-enter">></button>`;
  let arrowText = isMenu?`<div class="unimarklet grid-enter">></div>`:"";

  let nameText = `<span>${name}</span>` + (permanent?`<span class="unimarklet grid-permanent">Permanent</span>`:"");

  let addonHTML = `
  <div class="unimarklet grid-item">
    ${toggleText}
    <div class="unimarklet grid-name">${nameText}</div>
    <div class="unimarklet grid-desc">${desc}</div>
  </div>
  `;
  addonHTML = createElemFromText(addonHTML, parent);

  if (!isMenu) {
    let toggle = addonHTML.getElementsByClassName("grid-toggle")[0];
    addonHTML.addEventListener("click", e => {
      if (addon.enabled && permanent) {
        return;
      }

      addon.toggle();
      toggle.classList.toggle("active", addon.enabled);
    });
    setInterval(()=>{toggle.classList.toggle("active", addon.enabled)}, 100);
  } else {
    addonHTML.addEventListener("click", e => {
      mainAddon.addonPath.push(i);
      mainAddon.disable();
      mainAddon.enable();
    });
  }
}


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
