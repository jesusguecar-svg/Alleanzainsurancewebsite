"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type VelocityRef = { current: number };

type LiquidGallerySurfaceProps = {
  src: string;
  secondarySrc?: string;
  kind?: "video";
  position?: string;
  velocity: VelocityRef;
};

const vertexShader = `#version 300 es
precision highp float;
in vec2 aPosition;
uniform float uVelocity;
out vec2 vUv;
void main() {
  float speed = abs(uVelocity);
  float centeredX = aPosition.x * 2.0 - 1.0;
  float verticalArc = sin(aPosition.y * 3.14159265);
  vec2 position = aPosition * 2.0 - 1.0;
  position.x += uVelocity * verticalArc * (0.035 + centeredX * centeredX * 0.018);
  position.y += uVelocity * sin(aPosition.x * 3.14159265) * 0.012;
  position.x *= 1.0 + speed * 0.022;
  gl_Position = vec4(position, speed * (1.0 - centeredX * centeredX) * 0.02, 1.0);
  vUv = aPosition;
}`;

const fragmentShader = `#version 300 es
precision highp float;
uniform sampler2D uPrimary;
uniform sampler2D uSecondary;
uniform float uPrimaryAspect;
uniform float uSecondaryAspect;
uniform float uCanvasAspect;
uniform float uVelocity;
uniform float uHasSecondary;
uniform vec2 uPosition;
in vec2 vUv;
out vec4 outColor;

vec2 coverUv(vec2 uv, float sourceAspect, float targetAspect, vec2 focus) {
  vec2 scale = vec2(1.0);
  if (sourceAspect > targetAspect) scale.x = targetAspect / sourceAspect;
  else scale.y = sourceAspect / targetAspect;
  return uv * scale + (1.0 - scale) * focus;
}

void main() {
  float speed = abs(uVelocity);
  vec2 uv = vUv;
  float edge = pow(abs(uv.x - 0.5) * 2.0, 1.55);
  uv.x -= uVelocity * (0.013 + edge * 0.017) * sin(uv.y * 3.14159265);
  uv.y += sin(uv.x * 7.0 + uv.y * 2.2) * speed * 0.006;
  uv.x = 0.5 + (uv.x - 0.5) * (1.0 - speed * 0.018);

  vec4 color;
  if (uHasSecondary > 0.5) {
    float split = 0.58;
    if (uv.x < split) {
      vec2 localUv = vec2(uv.x / split, uv.y);
      color = texture(uPrimary, coverUv(localUv, uPrimaryAspect, uCanvasAspect * split, vec2(0.5)));
    } else {
      vec2 localUv = vec2((uv.x - split) / (1.0 - split), uv.y);
      color = texture(uSecondary, coverUv(localUv, uSecondaryAspect, uCanvasAspect * (1.0 - split), vec2(0.5)));
      color.rgb *= 0.985;
    }
    float seam = 1.0 - smoothstep(0.0, 0.004, abs(uv.x - split));
    color.rgb = mix(color.rgb, vec3(0.92), seam * 0.42);
  } else {
    color = texture(uPrimary, coverUv(uv, uPrimaryAspect, uCanvasAspect, uPosition));
  }
  color.rgb += speed * 0.018;
  outColor = color;
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function parsePosition(position = "50% 50%") {
  const values = position.match(/[\d.]+/g)?.map(Number) ?? [50, 50];
  return [Math.min(100, Math.max(0, values[0] ?? 50)) / 100, Math.min(100, Math.max(0, values[1] ?? 50)) / 100] as const;
}

function makeGrid(columns = 34, rows = 18) {
  const points: number[] = [];
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      const x0 = x / columns, x1 = (x + 1) / columns;
      const y0 = y / rows, y1 = (y + 1) / rows;
      points.push(x0,y0, x1,y0, x0,y1, x0,y1, x1,y0, x1,y1);
    }
  }
  return new Float32Array(points);
}

export function LiquidGallerySurface({ src, secondarySrc, kind, position, velocity }: LiquidGallerySurfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", { alpha: true, antialias: true });
    if (!canvas || !gl) return;
    const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const grid = makeGrid();
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, grid, gl.STATIC_DRAW);
    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const locations = {
      velocity: gl.getUniformLocation(program, "uVelocity"),
      primaryAspect: gl.getUniformLocation(program, "uPrimaryAspect"),
      secondaryAspect: gl.getUniformLocation(program, "uSecondaryAspect"),
      canvasAspect: gl.getUniformLocation(program, "uCanvasAspect"),
      hasSecondary: gl.getUniformLocation(program, "uHasSecondary"),
      position: gl.getUniformLocation(program, "uPosition"),
    };
    gl.uniform1i(gl.getUniformLocation(program, "uPrimary"), 0);
    gl.uniform1i(gl.getUniformLocation(program, "uSecondary"), 1);

    const createTexture = (unit: number) => {
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([224, 232, 235, 255]));
      return texture;
    };
    const primaryTexture = createTexture(0);
    const secondaryTexture = createTexture(1);
    let primaryAspect = 1, secondaryAspect = 1, primaryReady = false, secondaryReady = !secondarySrc;
    let disposed = false, frame = 0, easedVelocity = 0;
    const media: Array<HTMLImageElement | HTMLVideoElement> = [];

    const upload = (element: HTMLImageElement | HTMLVideoElement, texture: WebGLTexture | null, unit: number) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, element);
    };
    const loadMedia = (url: string, mediaKind: "video" | "image", texture: WebGLTexture | null, unit: number, ready: (aspect: number) => void) => {
      if (mediaKind === "video") {
        const element = document.createElement("video");
        element.src = url; element.muted = true; element.loop = true; element.playsInline = true; element.preload = "auto";
        element.addEventListener("loadeddata", () => { if (disposed) return; ready(element.videoWidth / element.videoHeight); void element.play(); }, { once: true });
        element.load(); media.push(element); return;
      }
      const element = new Image();
      element.decoding = "async";
      element.addEventListener("load", () => { if (disposed) return; upload(element, texture, unit); ready(element.naturalWidth / element.naturalHeight); }, { once: true });
      element.src = url; media.push(element);
    };
    loadMedia(src, kind === "video" ? "video" : "image", primaryTexture, 0, (aspect) => { primaryAspect = aspect; primaryReady = true; });
    if (secondarySrc) loadMedia(secondarySrc, "image", secondaryTexture, 1, (aspect) => { secondaryAspect = aspect; secondaryReady = true; });

    const [focusX, focusY] = parsePosition(position);
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas); resize();

    const render = () => {
      easedVelocity += ((reduceMotion ? 0 : velocity.current) - easedVelocity) * 0.105;
      const primary = media[0];
      if (primaryReady && primary instanceof HTMLVideoElement && primary.readyState >= 2) upload(primary, primaryTexture, 0);
      if (primaryReady && secondaryReady) {
        gl.useProgram(program);
        gl.uniform1f(locations.velocity, easedVelocity);
        gl.uniform1f(locations.primaryAspect, primaryAspect);
        gl.uniform1f(locations.secondaryAspect, secondaryAspect);
        gl.uniform1f(locations.canvasAspect, canvas.width / canvas.height);
        gl.uniform1f(locations.hasSecondary, secondarySrc ? 1 : 0);
        gl.uniform2f(locations.position, focusX, 1 - focusY);
        gl.drawArrays(gl.TRIANGLES, 0, grid.length / 2);
        canvas.dataset.ready = "true";
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect();
      media.forEach((element) => { if (element instanceof HTMLVideoElement) { element.pause(); element.removeAttribute("src"); element.load(); } });
      gl.deleteTexture(primaryTexture); gl.deleteTexture(secondaryTexture); gl.deleteBuffer(buffer);
      gl.deleteProgram(program); gl.deleteShader(vertex); gl.deleteShader(fragment);
    };
  }, [kind, position, reduceMotion, secondarySrc, src, velocity]);

  return <canvas ref={canvasRef} className="gallery-liquid-surface" aria-hidden="true" />;
}
