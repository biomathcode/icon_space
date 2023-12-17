import { optimize } from "svgo";

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
