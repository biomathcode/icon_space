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

import { optimize } from "svgo";
import { writeText } from "@tauri-apps/api/clipboard";
import toast from "react-hot-toast";

function optmiseSvg(svg: string): string {
  const result = optimize(svg, {
    path: "path-to.svg", // recommended
    multipass: true, // all other config fields are available here
  });

  const len = new TextEncoder().encode(svg).length;
  console.log("size: ", bytesToSize(len));

  return result.data as string;
}

export { optmiseSvg };

export function bytesToSize(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "n/a";
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes.length - 1
  );
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}
//TODO: Since all of the convertion are based on SVGO, It will be great if we can create just one api for using svg in jsx, vue, and svelte
// TODO: Add function to

const copyToClipboard = async (text: string) => {
  try {
    // Use the clipboard API to write text to the clipboard
    await writeText(text);

    // Optionally, you can notify the user that the text has been copied
    // or perform any other action after successful copying.
    console.log("Text copied to clipboard:", text);
    toast.success("Copied");
  } catch (error) {
    console.error("Error copying to clipboard:", error);
  }
};

export {
  downloadData,
  downloadPNG,
  downloadSVG,
  copyDataUrl,
  copySVG,
  copyToClipboard,
};
