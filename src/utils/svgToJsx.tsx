import svgtojsx from "@balajmarius/svg2jsx";

const convertSvgToJsx = async (svg: string) => {
  const jsx = await svgtojsx(svg, {
    type: "functional",
    cleanupIDs: true,
    jsxSingleQuote: true,
    memo: true,
  });

  return jsx;
};

export default convertSvgToJsx;
