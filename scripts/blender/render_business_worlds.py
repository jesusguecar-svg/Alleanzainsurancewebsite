"""Render the four Alleanza business worlds with Blender 5.x.

Run with:
  Blender --background --python scripts/blender/render_business_worlds.py
"""

from pathlib import Path
import math
import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "public" / "cinematic" / "business-worlds"
SOURCE = ROOT / "assets" / "blender" / "alleanza-business-worlds.blend"
OUTPUT.mkdir(parents=True, exist_ok=True)
SOURCE.parent.mkdir(parents=True, exist_ok=True)

NAVY = (0.0235, 0.0784, 0.1922, 1)
CYAN = (0.0157, 0.7529, 0.9961, 1)
TEAL = (0.1137, 0.8314, 0.7176, 1)
ICE = (0.78, 0.96, 1.0, 1)


def material(name, color, metallic=0.0, roughness=0.25, emission=0.0, alpha=1.0):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.diffuse_color = (*color[:3], alpha)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color[:3], 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Alpha"].default_value = alpha
    if emission:
        bsdf.inputs["Emission Color"].default_value = (*color[:3], 1)
        bsdf.inputs["Emission Strength"].default_value = emission
    if alpha < 1:
        mat.surface_render_method = "DITHERED"
    return mat


def add_uv_sphere(name, location, scale, mat):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bpy.ops.object.shade_smooth()
    obj.data.materials.append(mat)
    return obj


def add_cube(name, location, scale, mat, bevel=0.28, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bevel_mod = obj.modifiers.new("Soft bevel", "BEVEL")
    bevel_mod.width = bevel
    bevel_mod.segments = 6
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.shade_smooth()
    obj.data.materials.append(mat)
    return obj


def add_torus(name, location, major, minor, mat, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=major, minor_radius=minor, major_segments=96, minor_segments=20, location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    bpy.ops.object.shade_smooth()
    obj.data.materials.append(mat)
    return obj


def add_curve(name, points, bevel_depth, mat, cyclic=False):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = bevel_depth
    curve.bevel_resolution = 6
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for point, co in zip(spline.bezier_points, points):
        point.co = co
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"
    spline.use_cyclic_u = cyclic
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    return obj


def aim_at(obj, point=(0, 0, 0)):
    direction = Vector(point) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in bpy.data.curves:
        if block.users == 0:
            bpy.data.curves.remove(block)


def base_scene(accent):
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1200
    scene.render.resolution_y = 1200
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "WEBP"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.image_settings.quality = 86
    scene.render.film_transparent = False
    scene.render.image_settings.color_management = "FOLLOW_SCENE"
    scene.view_settings.look = "AgX - Medium High Contrast"

    world = bpy.data.worlds.get("World") or bpy.data.worlds.new("World")
    scene.world = world
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = NAVY
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.14

    bpy.ops.object.camera_add(location=(7.8, -10.8, 6.6))
    camera = bpy.context.object
    camera.data.lens = 54
    aim_at(camera, (0, 0, .55))
    scene.camera = camera

    bpy.ops.object.light_add(type="AREA", location=(2.5, -4, 7))
    key = bpy.context.object
    key.data.energy = 1250
    key.data.shape = "DISK"
    key.data.size = 5
    key.data.color = accent[:3]
    aim_at(key, (0, 0, 0))

    bpy.ops.object.light_add(type="AREA", location=(-5, -1, 2.5))
    fill = bpy.context.object
    fill.data.energy = 900
    fill.data.size = 5
    fill.data.color = ICE[:3]
    aim_at(fill, (0, 0, .5))

    bpy.ops.object.light_add(type="POINT", location=(1, 3, 1))
    rim = bpy.context.object
    rim.data.energy = 700
    rim.data.color = accent[:3]

    glass = material("Glass", ICE, metallic=.12, roughness=.12, alpha=.22)
    luminous = material(f"Glow-{accent[0]:.2f}", accent, metallic=.2, roughness=.18, emission=3.4)
    chrome = material("Chrome", (0.56, .68, .76, 1), metallic=.88, roughness=.16)
    dark = material("Deep navy", (0.012, .028, .07, 1), metallic=.5, roughness=.22)

    add_torus("Atmosphere outer", (0, 0, .25), 4.8, .022, luminous, rotation=(math.radians(72), 0, math.radians(18)))
    add_torus("Atmosphere inner", (0, 0, .25), 3.9, .012, glass, rotation=(math.radians(90), math.radians(18), math.radians(-8)))
    return glass, luminous, chrome, dark


def health_world(glass, glow, chrome, dark):
    add_uv_sphere("Health core", (0, 0, .6), (1.75, 1.75, 1.75), glass)
    add_cube("Cross vertical", (0, 0, .65), (.58, .34, 1.75), glow, bevel=.36, rotation=(math.radians(8), 0, math.radians(-8)))
    add_cube("Cross horizontal", (0, 0, .65), (1.55, .34, .58), glow, bevel=.36, rotation=(math.radians(8), 0, math.radians(-8)))
    add_torus("Health orbit", (0, 0, .65), 2.55, .08, chrome, rotation=(math.radians(73), math.radians(8), math.radians(20)))
    for i in range(7):
        a = i / 7 * math.tau
        add_uv_sphere(f"Health satellite {i}", (math.cos(a)*2.55, math.sin(a)*1.12, .65+math.sin(a)*1.35), (.11,.11,.11), glow)


def protection_world(glass, glow, chrome, dark):
    shield = [(-2.3, 0, 2.6), (0, 0, 3.5), (2.3, 0, 2.6), (2.0, 0, -.3), (0, 0, -2.4), (-2.0, 0, -.3)]
    add_curve("Protection shield", shield, .16, glow, cyclic=True)
    add_curve("Protection inner shield", [(x*.72, .12, z*.72+.25) for x, _, z in shield], .045, glass, cyclic=True)
    add_uv_sphere("Protected core", (0, .25, .65), (1.18, 1.18, 1.18), glass)
    add_uv_sphere("Protected light", (0, -.15, .65), (.62, .62, .62), glow)
    for i in range(3):
        add_torus(f"Protection ring {i}", (0, 0, .65), 1.65+i*.42, .035, chrome if i % 2 else glass, rotation=(math.radians(78-i*8), math.radians(i*15), math.radians(12+i*17)))


def life_world(glass, glow, chrome, dark):
    add_uv_sphere("Life adult one", (-.95, 0, .7), (1.45, 1.45, 1.45), glass)
    add_uv_sphere("Life adult two", (1.05, .15, .75), (1.32, 1.32, 1.32), glass)
    add_uv_sphere("Life child", (.05, -.8, -.65), (.9, .9, .9), glow)
    add_curve("Life embrace left", [(-2.6, .3, 2.0), (-2.9, -.1, -.2), (-1.2, -.6, -2.0), (.05, -.75, -2.2)], .11, glow)
    add_curve("Life embrace right", [(2.65, .3, 2.0), (2.8, -.1, -.2), (1.25, -.6, -2.0), (.05, -.75, -2.2)], .11, glow)
    add_torus("Life halo", (0, .1, .2), 3.15, .045, chrome, rotation=(math.radians(78), math.radians(8), 0))


def property_world(glass, glow, chrome, dark):
    add_cube("Property home", (0, 0, -.25), (2.05, 1.35, 1.55), glass, bevel=.24)
    add_cube("Property roof left", (-1.05, 0, 1.55), (1.7, 1.42, .18), glow, bevel=.12, rotation=(0, math.radians(-36), 0))
    add_cube("Property roof right", (1.05, 0, 1.55), (1.7, 1.42, .18), glow, bevel=.12, rotation=(0, math.radians(36), 0))
    add_cube("Property door", (0, -1.38, -.55), (.5, .12, .95), chrome, bevel=.12)
    add_torus("Property protection ring", (0, .1, .3), 3.25, .06, glow, rotation=(math.radians(78), math.radians(-9), math.radians(12)))
    for i, x in enumerate((-1.25, 1.25)):
        add_uv_sphere(f"Property light {i}", (x, -1.48, .3), (.23, .12, .23), glow)


def academy_world(glass, glow, chrome, dark):
    for i in range(5):
        add_cube(f"Academy step {i}", (-2.4+i*1.18, .15+i*.12, -1.75+i*.68), (.72, 1.25, .3), glass if i < 4 else glow, bevel=.18)
    add_curve("Academy ascent", [(-2.7,-.35,-1.2), (-1.3,-.6,-.1), (.25,-.6,.65), (1.7,-.5,1.65), (2.55,-.4,2.8)], .09, glow)
    add_uv_sphere("Academy goal", (2.55, -.4, 2.8), (.42,.42,.42), glow)
    add_torus("Academy knowledge ring", (0, .2, .6), 3.4, .035, chrome, rotation=(math.radians(78), math.radians(-14), math.radians(8)))


def work_world(glass, glow, chrome, dark):
    add_cube("Work foundation", (0, .25, -1.45), (2.75, 1.45, .28), glass, bevel=.2)
    heights = (1.25, 1.9, 2.65, 3.5)
    for i, height in enumerate(heights):
        x = -2.05 + i * 1.36
        add_cube(f"Work pillar {i}", (x, 0, -1.15 + height / 2), (.42, .7, height / 2), glow if i == 3 else glass, bevel=.2)
        add_uv_sphere(f"Work person {i}", (x, -.72, height + .02), (.24, .24, .24), glow if i == 3 else chrome)
    add_curve("Work trajectory", [(-2.5,-.85,-.3), (-1.1,-.9,.55), (.35,-.9,1.35), (2.2,-.85,2.75)], .09, glow)
    add_torus("Work horizon", (0, .1, .45), 3.55, .04, chrome, rotation=(math.radians(78), math.radians(10), math.radians(-8)))


builders = {
    "salud": (CYAN, health_world),
    "vida": (ICE, life_world),
    "property-casualty": (TEAL, property_world),
    "academia": (CYAN, academy_world),
    "work": ((1.0, .62, .18, 1), work_world),
}

for slug, (accent, builder) in builders.items():
    clear_scene()
    mats = base_scene(accent)
    builder(*mats)
    bpy.context.scene.render.filepath = str(OUTPUT / f"{slug}.webp")
    bpy.ops.render.render(write_still=True)

bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE))
print(f"Rendered {len(builders)} worlds to {OUTPUT}")
print(f"Saved Blender source to {SOURCE}")
