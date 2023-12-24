import { transform } from "@svgr/core";

const convertSvgToJsx = async (svg: string) => {
  const jsx = await transform(svg);

  return jsx;
};

export default convertSvgToJsx;
