import { getSVGIcon } from "./getSVGIcon";

import downloadData from "./downloadata";

function copySVG() {
  // confettiText.value = copiedText
  const svgString = getSVGIcon();

  navigator.clipboard.writeText(svgString || "");
}

function copyDataUrl() {
  const svgString = getSVGIcon();

  // Create SVG data url
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgString || "")}`;
  navigator.clipboard.writeText(dataUrl);
}

function downloadSVG(name: string) {
  const svgString = getSVGIcon();

  downloadData(
    `${name}.svg`,
    `data:image/svg+xml;base64,${btoa(svgString || "")}`
  );
}

function downloadPNG(size: number, name: string) {
  const svgString = getSVGIcon();

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const image = new Image();
  image.src = `data:image/svg+xml;base64,${btoa(svgString || "")}`;
  image.onload = function () {
    ctx?.drawImage(image, 0, 0);
    downloadData(`${name}.png`, canvas.toDataURL("image/png"));
  };
}

export { downloadData, downloadPNG, downloadSVG, copyDataUrl, copySVG };
