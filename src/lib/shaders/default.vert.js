export default `
#define PI 3.1415926535897932384626433832795
attribute vec4 a_position;
attribute vec4 a_color;

uniform float u_pointSize;
uniform vec2 u_resolution;

varying vec4 fColor;

void main() {
    gl_PointSize = u_pointSize;
    vec2 pos = ((a_position.xy / u_resolution) * 2.0 - 1.0) * vec2(1.0, -1.0);
    gl_Position = vec4(pos, 0, 1);
    fColor = a_color;
}
`;