import bpy
import math
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "public" / "cinematic" / "gallery" / "glass-plinth.png"
BLEND = ROOT / "public" / "cinematic" / "gallery" / "glass-plinth.blend"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 1800
scene.render.resolution_y = 1100
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.film_transparent = True
scene.render.filepath = str(OUTPUT)
scene.render.image_settings.color_depth = "8"
scene.view_settings.look = "AgX - Medium High Contrast"

def material(name, color, metallic=0.0, roughness=0.18, transmission=0.0, alpha=1.0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, alpha)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Transmission Weight"].default_value = transmission
    bsdf.inputs["IOR"].default_value = 1.46
    bsdf.inputs["Coat Weight"].default_value = 0.35
    bsdf.inputs["Alpha"].default_value = alpha
    mat.surface_render_method = "DITHERED"
    return mat

glass = material("Vidrio esmerilado", (0.77, 0.93, 0.98), roughness=0.13, transmission=0.62, alpha=0.58)
cyan = material("Cian Alleanza", (0.015, 0.54, 0.82), metallic=0.35, roughness=0.14)
pearl = material("Perla", (0.95, 0.97, 1.0), metallic=0.22, roughness=0.1)
navy = material("Azul profundo", (0.018, 0.055, 0.13), metallic=0.5, roughness=0.16)

def cylinder(name, radius, depth, z, mat, vertices=192):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=(0, 0, z))
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    bevel = obj.modifiers.new("Bordes suaves", "BEVEL")
    bevel.width = min(depth * 0.34, 0.16)
    bevel.segments = 5
    bpy.ops.object.shade_smooth()
    return obj

cylinder("Base de vidrio", 4.65, 0.68, 0.15, glass)
cylinder("Anillo inferior", 4.72, 0.10, -0.12, navy)
cylinder("Anillo luminoso", 4.70, 0.075, 0.48, cyan)
cylinder("Plataforma superior", 4.42, 0.16, 0.63, pearl)
cylinder("Nucleo interior", 3.78, 0.38, 0.28, glass)

for radius, z, minor, mat in [
    (4.52, 0.57, 0.045, pearl),
    (4.68, 0.45, 0.038, cyan),
    (4.55, -0.08, 0.035, navy),
]:
    bpy.ops.mesh.primitive_torus_add(major_radius=radius, minor_radius=minor, major_segments=192, minor_segments=16, location=(0, 0, z))
    bpy.context.object.data.materials.append(mat)
    bpy.ops.object.shade_smooth()

# A soft, physical shadow catcher shape baked into the transparent render.
bpy.ops.mesh.primitive_uv_sphere_add(segments=128, ring_count=64, location=(0, 0.15, -0.55), scale=(5.7, 2.0, 0.16))
shadow = bpy.context.object
shadow.data.materials.append(material("Sombra suave", (0.02, 0.05, 0.11), roughness=1.0, alpha=0.13))

def area(name, location, energy, size, color):
    bpy.ops.object.light_add(type="AREA", location=location)
    light = bpy.context.object
    light.name = name
    light.data.energy = energy
    light.data.shape = "DISK"
    light.data.size = size
    light.data.color = color
    return light

area("Luz principal", (-4.5, -4.5, 7), 1250, 5.5, (0.82, 0.94, 1.0))
area("Luz lateral", (5, -1, 4), 950, 4.0, (0.25, 0.78, 1.0))
area("Contraluz", (0, 4, 5), 1100, 4.0, (0.78, 0.87, 1.0))

bpy.ops.object.camera_add(location=(0, -13.5, 4.25))
camera = bpy.context.object
scene.camera = camera
camera.data.lens = 62

def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()

look_at(camera, (0, 0, 0.22))
scene.world.color = (0.8, 0.85, 0.9)

bpy.ops.wm.save_as_mainfile(filepath=str(BLEND))
bpy.ops.render.render(write_still=True)
print(f"Rendered {OUTPUT}")
