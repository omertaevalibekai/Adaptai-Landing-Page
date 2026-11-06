"""AdaptAI hero: стеклянная 3D-искра из логотипа, бесшовный цикл.

Запуск:
  blender -b --factory-startup --python blender/hero_star.py -- --preview 60
  blender -b --factory-startup --python blender/hero_star.py -- --render
"""
import bpy, bmesh, math, os, sys, time
T0 = time.time()
def mark(msg): print(f"[T+{time.time()-T0:6.1f}s] {msg}", flush=True)
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "renders")
os.makedirs(OUT, exist_ok=True)

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
PREVIEW = int(argv[argv.index("--preview") + 1]) if "--preview" in argv else None
RES_PCT = int(argv[argv.index("--res") + 1]) if "--res" in argv else 100
MOBILE = "--mobile" in argv
SAMPLES = int(argv[argv.index("--samples") + 1]) if "--samples" in argv else 96

FPS, FRAMES = 30, 240          # 8 с, кадры 0..239, 240-й == 0-му
CYAN = (0.0037, 0.48, 0.66, 1)  # #0BB8D3 в линейном пространстве

# ---------------------------------------------------------------- сцена
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "CYCLES"
prefs = bpy.context.preferences.addons["cycles"].preferences
prefs.compute_device_type = "OPTIX"
prefs.get_devices()
for d in prefs.devices:
    d.use = d.type == "OPTIX"
sc.cycles.device = "GPU"
sc.cycles.samples = SAMPLES
sc.cycles.use_denoising = True
sc.cycles.denoiser = "OPTIX"
sc.cycles.max_bounces = 8
sc.cycles.transmission_bounces = 8
sc.cycles.glossy_bounces = 4
sc.cycles.use_adaptive_sampling = True
sc.cycles.adaptive_threshold = 0.02
sc.render.use_persistent_data = True
sc.cycles.caustics_reflective = False
sc.cycles.caustics_refractive = False
sc.render.resolution_x, sc.render.resolution_y = (720, 1800) if MOBILE else (1920, 1080)
sc.render.resolution_percentage = RES_PCT
sc.render.fps = FPS
sc.frame_start, sc.frame_end = 0, FRAMES - 1
sc.view_settings.view_transform = "Standard"   # фон = чистый белый #FFFFFF
sc.view_settings.look = "None"
sc.view_settings.exposure = 0.0

# ---------------------------------------------------------------- мир
world = bpy.data.worlds.new("World"); sc.world = world
world.use_nodes = True
nt = world.node_tree; nt.nodes.clear()
hdri = os.path.join(bpy.utils.system_resource("DATAFILES"), "studiolights", "world", "studio.exr")
env = nt.nodes.new("ShaderNodeTexEnvironment"); env.image = bpy.data.images.load(hdri)
tint = nt.nodes.new("ShaderNodeMix"); tint.data_type = "RGBA"
tint.inputs["Factor"].default_value = 0.45
tint.inputs["A"].default_value = (1, 1, 1, 1)
bg_env = nt.nodes.new("ShaderNodeBackground"); bg_env.inputs[1].default_value = 1.0
bg_white = nt.nodes.new("ShaderNodeBackground")
bg_white.inputs[0].default_value = (1, 1, 1, 1); bg_white.inputs[1].default_value = 1.0
lp = nt.nodes.new("ShaderNodeLightPath")
mix = nt.nodes.new("ShaderNodeMixShader")
out = nt.nodes.new("ShaderNodeOutputWorld")
nt.links.new(env.outputs[0], tint.inputs["B"])
nt.links.new(tint.outputs["Result"], bg_env.inputs[0])
nt.links.new(lp.outputs["Is Camera Ray"], mix.inputs[0])
nt.links.new(bg_env.outputs[0], mix.inputs[1])
nt.links.new(bg_white.outputs[0], mix.inputs[2])
nt.links.new(mix.outputs[0], out.inputs[0])

# ---------------------------------------------------------------- материалы
def glass(name, color, rough, absorb):
    m = bpy.data.materials.new(name); m.use_nodes = True
    n = m.node_tree.nodes; l = m.node_tree.links
    p = n["Principled BSDF"]
    p.inputs["Base Color"].default_value = color
    p.inputs["Roughness"].default_value = rough
    p.inputs["IOR"].default_value = 1.45
    p.inputs["Transmission Weight"].default_value = 1.0
    p.inputs["Coat Weight"].default_value = 0.4
    if absorb <= 0:
        return m
    vol = n.new("ShaderNodeVolumeAbsorption")
    vol.inputs["Color"].default_value = color
    vol.inputs["Density"].default_value = absorb
    l.new(vol.outputs[0], n["Material Output"].inputs["Volume"])
    return m

def glossy(name, color, rough):
    m = bpy.data.materials.new(name); m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = color
    p.inputs["Roughness"].default_value = rough
    p.inputs["Coat Weight"].default_value = 1.0
    p.inputs["Coat Roughness"].default_value = 0.05
    return m

M_STAR = glossy("StarGloss", CYAN, 0.22)
M_SMALL = glossy("SmallSparkle", CYAN, 0.25)
M_PLUS = glass("PlusGlass", (0.06, 0.62, 0.78, 1), 0.1, 0)

# ---------------------------------------------------------------- геометрия
def softmin(a, b, k):
    return -k * math.log(math.exp(-a / k) + math.exp(-b / k))

def star_outline(n, p=3.6, tip=0.95, k=0.03):
    """Вогнутая 4-лучевая искра, кончики скруглены soft-min по радиусу."""
    pts = []
    for i in range(n):
        t = 2 * math.pi * i / n
        c, s = math.cos(t), math.sin(t)
        x = math.copysign(abs(c) ** p, c)
        z = math.copysign(abs(s) ** p, s)
        r = math.hypot(x, z)
        r2 = softmin(r, tip, k)
        f = r2 / r if r > 1e-9 else 1
        pts.append((x * f, z * f))
    return pts

def puffy_star(name, size, depth, puff=0.45, n=384, rings=48):
    """Объёмная «подушка»: контур сжимается к центру по cos(phi)^puff."""
    outline = star_outline(n)
    bm = bmesh.new()
    grid = []
    for j in range(1, rings):
        phi = -math.pi / 2 + math.pi * j / rings
        k = math.cos(phi) ** puff
        y = depth * math.sin(phi)
        grid.append([bm.verts.new((x * k * size, y, z * k * size)) for x, z in outline])
    top = bm.verts.new((0, depth, 0)); bot = bm.verts.new((0, -depth, 0))
    for j in range(len(grid) - 1):
        a, b = grid[j], grid[j + 1]
        for i in range(n):
            bm.faces.new((a[i], a[(i + 1) % n], b[(i + 1) % n], b[i]))
    for i in range(n):
        bm.faces.new((grid[0][(i + 1) % n], grid[0][i], bot))
        bm.faces.new((grid[-1][i], grid[-1][(i + 1) % n], top))
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for f in me.polygons:
        f.use_smooth = True
    ob = bpy.data.objects.new(name, me); sc.collection.objects.link(ob)
    ob.modifiers.new("Subd", "SUBSURF").levels = 1
    ob.modifiers["Subd"].render_levels = 1
    return ob

def rounded_plus(name, size, depth):
    bars = []
    for sx, sz in ((1, 0.36), (0.36, 1)):
        bpy.ops.mesh.primitive_cube_add(size=1)
        c = bpy.context.object
        c.scale = (size * sx, depth, size * sz)
        bpy.ops.object.transform_apply(scale=True)
        bars.append(c)
    bpy.context.view_layer.objects.active = bars[0]
    for b in bars:
        b.select_set(True)
    bpy.ops.object.join()
    ob = bpy.context.object; ob.name = name
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.remove_doubles()
    bpy.ops.object.mode_set(mode="OBJECT")
    bm_ = ob.modifiers.new("Bevel", "BEVEL"); bm_.width = size * 0.16; bm_.segments = 8
    bm_.limit_method = "ANGLE"
    ob.modifiers.new("Subd", "SUBSURF").render_levels = 1
    for f in ob.data.polygons:
        f.use_smooth = True
    return ob

star = puffy_star("Star", 0.62 if MOBILE else 0.95, 0.22 if MOBILE else 0.3, puff=0.35); star.data.materials.append(M_STAR)
small = puffy_star("SmallStar", 0.22 if MOBILE else 0.3, 0.08 if MOBILE else 0.11, puff=0.35); small.data.materials.append(M_SMALL)
plus = rounded_plus("Plus", 0.28 if MOBILE else 0.4, 0.1 if MOBILE else 0.13); plus.data.materials.append(M_PLUS)

if MOBILE:   # видимая область ±1.29 по X, ±3.24 по Z; объекты выглядывают из-за краёв
    STAR_POS = Vector((1.38, 0, 0.5))
    SMALL_POS = Vector((-1.22, -0.3, 1.8))
    PLUS_POS = Vector((-1.18, 0.2, 0.62))
else:
    STAR_POS = Vector((2.62, 0, 0.62))
    SMALL_POS = Vector((-2.45, -0.3, 0.05))
    PLUS_POS = Vector((-2.3, 0.2, 1.3))

# ---------------------------------------------------------------- свет и камера
def area(name, loc, energy, size, color=(1, 1, 1)):
    l = bpy.data.lights.new(name, "AREA"); l.energy = energy; l.size = size; l.color = color
    o = bpy.data.objects.new(name, l); sc.collection.objects.link(o); o.location = loc
    d = Vector((0, 0, 0)) - Vector(loc)
    o.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    return o

area("Key", (-4, -5, 5), 520, 5)
area("Rim", (5, 4, 3), 700, 3, (0.75, 0.95, 1.0))
area("Fill", (4, -6, -2), 110, 6)

cam_data = bpy.data.cameras.new("Cam"); cam_data.lens = 50
cam = bpy.data.objects.new("Cam", cam_data); sc.collection.objects.link(cam)
cam.location = (0, -9, 0); cam.rotation_euler = (math.radians(90), 0, 0)
sc.camera = cam

# ---------------------------------------------------------------- анимация (бесшовная)
TAU = 2 * math.pi
for f in range(FRAMES + 1):
    t = f / FRAMES
    star.location = STAR_POS + Vector((0, 0, 0.06 * math.sin(TAU * t)))
    star.rotation_euler = (math.radians(14) * math.sin(TAU * t),
                           -math.radians(90) * t,            # 4-кратная симметрия: 90° = полный цикл
                           math.radians(20) * math.sin(TAU * t + 1.2))
    small.location = SMALL_POS + Vector((0.06 * math.cos(TAU * t), 0, 0.1 * math.sin(TAU * t)))
    small.rotation_euler = (math.radians(25) * math.sin(TAU * t + 0.5), math.radians(180) * t,
                            math.radians(25) * math.cos(TAU * t))
    plus.location = PLUS_POS + Vector((0, 0, 0.08 * math.sin(TAU * t + 2.0)))
    plus.rotation_euler = (math.radians(30) * math.sin(TAU * t + 1.0), -math.radians(90) * t,
                           math.radians(30) * math.cos(TAU * t + 1.0))
    for o in (star, small, plus):
        o.keyframe_insert("location", frame=f)
        o.keyframe_insert("rotation_euler", frame=f)
for o in (star, small, plus):
    for fc in o.animation_data.action.layers[0].strips[0].channelbag(o.animation_data.action_slot).fcurves \
            if hasattr(o.animation_data.action, "layers") else o.animation_data.action.fcurves:
        for kp in fc.keyframe_points:
            kp.interpolation = "LINEAR"

mark("scene built")
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, "hero_star_mobile.blend" if MOBILE else "hero_star.blend"))

# ---------------------------------------------------------------- рендер
if PREVIEW is not None:
    sc.frame_set(PREVIEW)
    sc.render.filepath = os.path.join(OUT, f"preview{'_m' if MOBILE else ''}_{PREVIEW:03d}.png")
    bpy.ops.render.render(write_still=True)
    mark("preview rendered")
elif "--render" in argv:
    sc.render.image_settings.file_format = "PNG"
    sc.render.filepath = os.path.join(OUT, "frames_mobile" if MOBILE else "frames", "f_")
    bpy.ops.render.render(animation=True)
    mark("animation rendered")
