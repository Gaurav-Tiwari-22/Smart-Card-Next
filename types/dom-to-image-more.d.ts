declare module 'dom-to-image-more' {
  const domtoimage: {
    toSvg(node: HTMLElement, options?: object): Promise<string>;
    toPng(node: HTMLElement, options?: object): Promise<string>;
    toJpeg(node: HTMLElement, options?: object): Promise<string>;
    toBlob(node: HTMLElement, options?: object): Promise<Blob>;
    toPixelData(node: HTMLElement, options?: object): Promise<Uint8ClampedArray>;
  };
  export default domtoimage;
}
