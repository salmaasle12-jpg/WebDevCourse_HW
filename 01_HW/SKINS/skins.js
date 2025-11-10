const skins = [
    'dark.css',
    'modern.css',
    'basic.css'
];

let currentSkin = 0;

function ChangeSkin() {
   
    const link = document.getElementById("skin-link");
    currentSkin = (currentSkin + 1) % skins.length;
    link.href = skins[currentSkin];
}
