export default function(url) {
    const win = window;
    const randomImage = '____dj' + Math.random()
    const img = win[randomImage] = new Image();
    img.onload = img.onerror = function () { 
        win[randomImage] = null; 
    }
    img.src = url;
}