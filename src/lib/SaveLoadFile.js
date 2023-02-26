/**
 * This class is used to save drawings to a file
 */
export default class SaveLoadFile {
    /**
     * @param {Object} canvas Requires a canvas
     * @param {WebGLRenderingContext} gl Requires an instance of WebGL canvas
     */
    static save(canvas, gl) {
        let w = canvas.width;
        let h = canvas.height;
        let center_x = w / 2;
        let center_y = h / 2;
        let pixels = new Uint8Array(4);
        gl.readPixels(center_x, center_y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        console.log(pixels.toString());
    }
}