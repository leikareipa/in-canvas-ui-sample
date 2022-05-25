/*
 * 2022 Tarpeeksi Hyvae Soft
 * 
 */

const buffer = [];
const canvasEl = document.querySelector("#canvas");

export function pickBuffer() {
    return buffer;
}

export function pickAt(x, y) {
    const canvasWidth = canvasEl.getAttribute("width");
    return buffer[x + y * canvasWidth];
}

export function isComponentHovered(componentId = "") {
    return (pickAt(window.mouseX, window.mouseY)?.id === componentId);
}

export function resetPickBuffer() {
    buffer.fill({});
}

window.onmousemove = function(event) {
    if (event.target === canvasEl) {
        window.mouseX = (event.clientX - canvasEl.getBoundingClientRect().left);
        window.mouseY = (event.clientY - canvasEl.getBoundingClientRect().top);
    }
}
