
javascript:(function(){
    if (typeof source == "undefined") {
        alert("Go here and change the bookmark to the text there: https://raw.githubusercontent.com/Nisseboy/Unimarklet/master/bookmarklet.js");
        return;
    }
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

  enable(...args) {
    let temp = this;
    this.enableFn(
      (text)=>{let elem = createElemFromText(text); temp.addedHTML.push(elem); return elem;}, 
      (text)=>{let elem = createStyles(text); temp.addedCSS.push(elem); return elem;},
      this,
      ...args
    );

    this.enabled = true;

    window.enabledAddons[this.desc.name] = this;
  }

  disable(...args) {
    this.disableFn(this, ...args);
    
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

let addons = [];
function createAddon(_addon) {
  return window.enabledAddons[_addon.desc.name] || new Addon(_addon.desc, _addon.init, _addon.destroy);
}



/*
All custom addons
*/
if (false) {
//new addon
var a = {
  desc: {
    name: "Party Time",
    desc: "Makes the page ooh yea",
    allowed: ["*"],
    permanent: false,
    path: "",
  },
  init: (addHTML, addCSS, addon, ...args) => {
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
      z-index: 99999999;
      
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
  destroy: (addon, ...args) => {
    
  }
};

//new addon
var a =  {
  desc: {
    name: "Games",
    desc: "Collection of games",
    allowed: ["*"],
    radio: true,
    path: "",
  },
  addons: [],
};

//new addon
var a =  {
  desc: {
    name: "Fix Schoolsoft",
    desc: "Makes schoolsoft look a bit more like the old version.",
    allowed: ["schoolsoft.se"],
    permanent: false,
    path: "",
  },
  init: (addHTML, addCSS, addon, ...args) => {
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
  destroy: (addon, ...args) => {

  }
};

//new addon
var a =  {
  desc: {
    name: "Edit Anything",
    desc: "Makes everything on the page editable.",
    allowed: ["*"],
    permanent: false,
    path: "",
  },
  init: (addHTML, addCSS, addon, ...args) => {
    addon.oldSpellCheck = document.body.spellcheck;
    document.body.contentEditable = true;
    document.body.spellcheck = false;
  },
  destroy: (addon, ...args) => {
    document.body.contentEditable = false;
    document.body.spellcheck = addon.oldSpellCheck;
  }
};

//new addon
var a =  {
  desc: {
    name: "Fullscreen Pro",
    desc: "Puts the page in a professional fullscreen mode, Escape to exit. This is not a toggle.",
    allowed: ["*"],
    permanent: false,
    path: "",
  },
  init: (addHTML, addCSS, addon, ...args) => {
    document.body.requestFullscreen({navigationUI: "hide"});
    addon.disable();
  },
  destroy: (addon, ...args) => {
    
  }
};

//new addon
var a =  {
  desc: {
    name: "Reverse Text",
    desc: "Reverses all the words on the page",
    allowed: "*",
    permanent: false,
    path: "",
  },
  init: (addHTML, addCSS, addon, ...args) => {
    addon.elems = document.querySelectorAll("*");
    for (let i = 0; i < addon.elems.length; i++) {
      let elem = addon.elems[i];
      if (elem.innerText && elem.childElementCount == 0)
      elem.innerText = elem.innerText.split("").reverse().join("");
    }
  },
  destroy: (addon, ...args) => {
    for (let i = 0; i < addon.elems.length; i++) {
      let elem = addon.elems[i];
      if (elem.innerText && elem.childElementCount == 0)
      elem.innerText = elem.innerText.split("").reverse().join("");
    }
  }
};

//new addon
var a =  {
  desc: {
    name: "Erik Mode",
    desc: "Enables Erik mode. (Sound on)",
    allowed: "*",
    permanent: false,
    path: "",
  },
  init: (addHTML, addCSS, addon, ...args) => {
    let elem = addHTML(`<div style="position: absolute"></div>`);

    let audios = [];
    let audioPtr = {a:0};
    for (let i = 0; i < 30; i++) {
      let a = document.createElement("audio");
      a.src = "https://notification-sounds.com/soundsfiles/Goat-noise.mp3";
      elem.appendChild(a);

      audios.push(a);
    }
    
    addon.func = () => {
      let a = audios[audioPtr.a];
      a.currentTime = 0;
      a.play();
      audioPtr.a = (audioPtr.a + 1) % audios.length;
    }
    addon.func();

    document.addEventListener("keydown", addon.func);
  },
  destroy: (addon, ...args)=>{
    document.removeEventListener("keydown", addon.func);
  }
};

//new addon
var a = {
  desc: {
    name: "Youtubeifier",
    desc: "Edits all youtube links in a page to make them clickable",
    allowed: ["*"],
    permanent: true,
    path: "",
  },
  init: (addHTML, addCSS, addon, ...args) => {
    let elems = document.querySelectorAll("*[href*=\"watch?v=\"]");

    for (let i = 0; i < elems.length; i++) {
        let elem = elems[i];
        elem.href = elem.href.replace("watch?v=", "embed/");
    }
  },
  destroy: (addon, ...args) => {

  },
}

//new addon
var a =  {
  desc: {
    name: "Cookie Clicker",
    desc: "Collection of addons for Cookie Clicker",
    allowed: ["orteil.dashnet.org/cookieclicker"],
    path: "",
  },
  addons: [],
};

//new addon
var a =  {
  desc: {
    name: "Cookie Monster",
    desc: "Activates the cookie monster mod",
    allowed: ["*"],
    permanent: true,
    path: "Cookie Clicker",
  },
  init: (addHTML, addCSS, addon, ...args) => {
    Game.LoadMod("https://cookiemonsterteam.github.io/CookieMonster/dist/CookieMonster.js");
  },
  destroy: (addon, ...args) => {

  }
}


//new addon
var a =  {
  desc: {
    name: "Main Addon",
    desc: "This addon manages all the other addons",
    allowed: ["*"],
    permanent: false,
    path: "",
  },
  init: (addHTML, addCSS, addon, ...args)=>{
    if (!addon.addonPath) addon.addonPath = [];

    let returnText = (addon.addonPath.length > 0)?`<button class="unimarklet return"><</button>`:"";
    let mainHTML = `
    <div class="unimarklet main">
      ${returnText}
      <div class="unimarklet addon-grid"></div>
      <button class="unimarklet delete"></button>
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
      font-family: sans-serif;
      color: white;
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
      grid-template-rows: 1.2rem 1.2rem;

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
    .unimarklet.addon-grid.radio .grid-toggle {
      border-radius: 50%;
    }
    .unimarklet.grid-desc {
      grid-column: 1 / 3;
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
    .unimarklet.grid-img {
      grid-row: 1 / 3;
      height: 100%;
      aspect-ratio: 1 / 1;
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

      background: none;
      border: none;
      cursor: pointer;

      width: 1.2rem;
      height: 1.2rem;

      display: grid;
      place-items: center;
    }
    .unimarklet.delete::before,
    .unimarklet.delete::after {
      content: "";
      width: 90%;
      height: 3px;
      border-radius: 1rem;
      background-color: red;

      position: absolute;
    }
    .unimarklet.delete::before {
      rotate: 45deg;
    }
    .unimarklet.delete::after {
      rotate: -45deg;
    }
    `;
    mainHTML = addHTML(mainHTML);
    mainCSS = addCSS(mainCSS);

    mainHTML.getElementsByClassName("delete")[0].addEventListener("click", e => {
      addon.disable();
    });
    mainHTML.getElementsByClassName("return")[0]?.addEventListener("click", e => {
      addon.addonPath.splice(-1, 1);
      addon.disable(); 
      addon.enable();
    });

    let tempAddons = addons;
    let pAddon = addon;
    for (let i = 0; i < addon.addonPath.length; i++) {
      let path = addon.addonPath[i];
      pAddon = tempAddons[path];
      tempAddons = tempAddons[path].addons;
    } 
    
    let desc = pAddon.desc;
    mainHTML.getElementsByClassName("addon-grid")[0].classList.toggle("radio", !!desc.radio);

    let grid = mainHTML.getElementsByClassName("addon-grid")[0];
    grid.replaceChildren();
    for (let i in tempAddons) {
      if (tempAddons[i].desc.name != "Main Addon")
      createAddonElem(tempAddons[i], i, grid, pAddon);
    }
  },
  destroy: (addon, ...args) => {

  }
};

//new addon
}

let splitSource = source.split("//new addon");
splitSource.splice(0, 1);
splitSource.splice(-2, 2);


let gameSources = [
  {
    name: "Subway Surfers",
    url: "https://subway-surfer-monaco.nugeshinia.repl.co/"
  },
  {
    name: "Time Shooter",
    url: "https://timeshooter.application08.repl.co/"
  },
  {
    name: "Getting Over It",
    url: "https://scratch.mit.edu/projects/389464290/embed/"
  },
  {
    name: "Recoil",
    url: "https://sipragio06.github.io/recoil/"
  },
  {
    name: "Moto X3M",
    url: "https://webglmath.github.io/moto-x3m/"
  },
  {
    name: "Minecraft",
    url: "https://watchdocumentaries.com/wp-content/uploads/games/minecraft-classic/"
  }
];
for (let i of gameSources) {
  let name = i.name;
  let url = i.url;

  splitSource.push(`
let name = "${name}";
let url = "${url}";

var a = {
  desc: {
    name: name,
    desc: \`Creates a window of \${name}, press § to show.\`,
    allowed: ["*"],
    permanent: false,
    path: "Games",
  },
  init: (addHTML, addCSS, addon, ...args) => {
    let allHTML = \`
    <iframe class="game-window" src="\${url}"></iframe>
    \`;
    let allCSS = \`
    .game-window {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
    }
    \`;
    allHTML = addHTML(allHTML);
    addCSS(allCSS);
    
    addon.handler = e => {
      if (e.key == "§") {
        allHTML.requestFullscreen();
      }
    }

    document.addEventListener("keydown", addon.handler);
  },
  destroy: (addon, ...args) => {
    document.removeEventListener("keydown", addon.handler);
  }
};

`);
}

for (let i = 0; i < splitSource.length; i++) {
  let text = splitSource[i];
  text = text.split("\n");
  text.splice(0, 1);
  text.splice(-2, 2);
  text = text.join("\n");

  eval(text);
  
  let path = a.desc.path.split("/");

  if (!a.addons) {
    a = createAddon(a);
  }

  let parent = addons;

  for (let i in path) {
    let name = path[i];
    if (name == "") continue;

    for (let i of parent) {
      if (i.desc.name.replaceAll("\r", "") == name.replaceAll("\r", "")) {
        parent = i.addons;
        break;
      }
    }
  }

  a.source = text;
  parent.push(a);
}
mainAddon.enable();


/*
This function takes an addon and creates and appends an element to specfied parent
*/
function createAddonElem(addon, i, parent, parentAddon) {
  let isMenu = !!addon.addons;
  let isRadio = parentAddon.desc.radio;

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

      if (addon.enabled && isRadio) {
        for (let i of parentAddon.addons) {
          if (i.enabled && i != addon) {
            i.disable();
          }
        }

        mainAddon.disable();
        mainAddon.enable();
      }
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
Takes an allowed array ("*", "google.com") and returns true if the addon should be available
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

