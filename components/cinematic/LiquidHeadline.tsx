"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const vertexShader = `#version 300 es
in vec2 aPosition;
uniform vec4 uRect;
out vec2 vUv;
void main() {
  vec2 position = uRect.xy + aPosition * uRect.zw;
  gl_Position = vec4(position, 0.0, 1.0);
  vUv = aPosition;
}`;

const fragmentShader = `#version 300 es
precision highp float;
uniform sampler2D uGlyph;
uniform vec2 uMouse;
uniform float uStrength;
uniform float uTime;
in vec2 vUv;
out vec4 outColor;
void main() {
  vec2 delta = vUv - uMouse;
  float distanceToCursor = length(delta);
  float falloff = smoothstep(0.58, 0.0, distanceToCursor);
  vec2 direction = normalize(delta + vec2(0.0001));
  float ripple = sin(distanceToCursor * 24.0 - uTime * 5.2) * 0.011;
  vec2 displacement = direction * (falloff * uStrength * 0.115 + ripple * falloff * uStrength);
  displacement.x += sin((vUv.y + uTime * 0.1) * 18.0) * falloff * uStrength * 0.009;
  displacement.y += cos((vUv.x - uTime * 0.08) * 16.0) * falloff * uStrength * 0.006;
  vec4 glyph = texture(uGlyph, clamp(vUv - displacement, 0.0, 1.0));
  outColor = vec4(vec3(0.015, 0.018, 0.02), glyph.a);
}`;

function shader(gl: WebGL2RenderingContext, type: number, source: string) {
  const compiled = gl.createShader(type);
  if (!compiled) return null;
  gl.shaderSource(compiled, source);
  gl.compileShader(compiled);
  if (!gl.getShaderParameter(compiled, gl.COMPILE_STATUS)) {
    gl.deleteShader(compiled);
    return null;
  }
  return compiled;
}

export function LiquidHeadline({ text, className = "" }: { text: string; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", { alpha: true, antialias: true, premultipliedAlpha: true });
    if (!canvas || !gl) return;
    const vertex = shader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = shader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 1,0, 0,1, 0,1, 1,0, 1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const rectLocation = gl.getUniformLocation(program, "uRect");
    const mouseLocation = gl.getUniformLocation(program, "uMouse");
    const strengthLocation = gl.getUniformLocation(program, "uStrength");
    const timeLocation = gl.getUniformLocation(program, "uTime");
    const glyphLocation = gl.getUniformLocation(program, "uGlyph");
    gl.uniform1i(glyphLocation, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const textures = [...text].map((letter) => {
      const source = document.createElement("canvas");
      const context = source.getContext("2d")!;
      context.font = "300px Georgia";
      const width = Math.ceil(context.measureText(letter).width + 10);
      source.width = width;
      source.height = 370;
      context.font = "300px Georgia";
      context.fillStyle = "#000";
      context.textAlign = "center";
      context.textBaseline = "alphabetic";
      context.fillText(letter, width / 2, 304);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      return { texture, aspect: width / 300 };
    });

    const pointer = { targetX: -2, targetY: -2, x: -2, y: -2, targetStrength: 0, strength: 0, targetPress: 0, press: 0 };
    const updatePoint = (clientX: number, clientY: number, strength = 1) => {
      const box = canvas.getBoundingClientRect();
      pointer.targetX = (clientX - box.left) / box.width;
      pointer.targetY = (clientY - box.top) / box.height;
      pointer.targetStrength = strength;
    };
    const onMove = (event: PointerEvent) => {
      updatePoint(event.clientX, event.clientY);
    };
    const onTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      updatePoint(touch.clientX, touch.clientY);
    };
    const onPointerDown = (event: PointerEvent) => { updatePoint(event.clientX, event.clientY, .28); pointer.targetPress = 1; };
    const onPointerUp = () => { pointer.targetPress = 0; };
    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      updatePoint(touch.clientX, touch.clientY, .28);
      pointer.targetPress = 1;
    };
    const onLeave = () => { pointer.targetStrength = 0; pointer.targetPress = 0; };
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onLeave);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouch, { passive: true });
    canvas.addEventListener("touchend", onLeave, { passive: true });
    canvas.addEventListener("touchcancel", onLeave, { passive: true });

    let frame = 0;
    let glyphRects: Array<{ left: number; top: number; width: number; height: number }> = [];
    const glyphPress = textures.map(() => 0);
    const resize = () => {
      const box = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(box.width * ratio));
      canvas.height = Math.max(1, Math.round(box.height * ratio));
      gl.viewport(0, 0, canvas.width, canvas.height);
      const rawWidth = textures.reduce((sum, item) => sum + item.aspect, 0);
      const gap = .0005;
      const availableWidth = .96 - gap * (textures.length - 1);
      const canvasAspectCorrection = box.height / box.width;
      const height = Math.min(.92, availableWidth / (rawWidth * canvasAspectCorrection / 1.12));
      const widths = textures.map((item) => item.aspect * height * canvasAspectCorrection / 1.12);
      const totalWidth = widths.reduce((sum, width) => sum + width, 0) + gap * (textures.length - 1);
      let left = (1 - totalWidth) / 2;
      glyphRects = widths.map((width) => {
        const rect = { left, top: (1 - height) / 2, width, height };
        left += width + gap;
        return rect;
      });
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const render = (milliseconds: number) => {
      pointer.x += (pointer.targetX - pointer.x) * .13;
      pointer.y += (pointer.targetY - pointer.y) * .13;
      pointer.strength += ((reduceMotion ? 0 : pointer.targetStrength) - pointer.strength) * .16;
      pointer.press += ((reduceMotion ? 0 : pointer.targetPress) - pointer.press) * .18;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const focusIndex = glyphRects.findIndex((rect) => pointer.targetX >= rect.left && pointer.targetX <= rect.left + rect.width && pointer.targetY >= rect.top && pointer.targetY <= rect.top + rect.height);
      textures.forEach((item, index) => {
        const rect = glyphRects[index];
        if (!rect) return;
        const pressTarget = index === focusIndex ? pointer.press : 0;
        glyphPress[index] += (pressTarget - glyphPress[index]) * .2;
        const scale = 1 + glyphPress[index] * .24;
        const drawRect = {
          left: rect.left - rect.width * (scale - 1) / 2,
          top: rect.top - rect.height * (scale - 1) / 2,
          width: rect.width * scale,
          height: rect.height * scale,
        };
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, item.texture);
        gl.uniform4f(rectLocation, drawRect.left * 2 - 1, 1 - (drawRect.top + drawRect.height) * 2, drawRect.width * 2, drawRect.height * 2);
        gl.uniform2f(mouseLocation, (pointer.x - drawRect.left) / drawRect.width, 1 - (pointer.y - drawRect.top) / drawRect.height);
        gl.uniform1f(strengthLocation, pointer.strength + pointer.press * .2);
        gl.uniform1f(timeLocation, milliseconds / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      });
      canvas.dataset.ready = "true";
      canvas.parentElement?.classList.add("is-webgl-ready");
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      canvas.parentElement?.classList.remove("is-webgl-ready");
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onLeave);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchend", onLeave);
      canvas.removeEventListener("touchcancel", onLeave);
      textures.forEach(({ texture }) => gl.deleteTexture(texture));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [reduceMotion, text]);

  return <div className={`liquid-headline ${className}`}><span className="liquid-headline-fallback" aria-hidden="true">{text}</span><canvas ref={canvasRef} aria-hidden="true"/><span className="sr-only">{text}</span></div>;
}
