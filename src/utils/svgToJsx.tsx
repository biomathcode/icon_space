import { transform } from "@svgr/core";

interface ConvertSvgToJsxOptions {
  componentName: string;
}

export async function convertSvgToJsx(
  svgContent: string,
  options: ConvertSvgToJsxOptions
): Promise<string> {
  try {
    const jsxCode = await transform(
      svgContent,
      {},
      { componentName: options.componentName }
    );
    return jsxCode;
  } catch (error) {
    throw new Error(`SVG to JSX conversion failed: ${error}`);
  }
}
