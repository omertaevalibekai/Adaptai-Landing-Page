"""Общий стиль сцен AdaptAI: белый фон, бирюзовый глянец и стекло, студийный свет.

Сцены импортируют этот модуль и вызывают:
    args = setup(name, res=(1080, 1080), frames=240)
    ... строят объекты, ставят ключи через animate(frames, fn) ...
    finish(args)
Флаги запуска (после `--`): --preview N, --render, --samples S, --res PCT
"""
import bpy, bmesh, math, os, sys, time
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
TAU = 2 * math.pi
CYAN = (0.0037, 0.48, 0.66, 1)          # #0BB8D3
CYAN_DEEP = (0.06, 0.62, 0.78, 1)
PEARL = (0.80, 0.93, 0.96, 1)
T0 = time.time()


def mark(msg):
    print(f"[T+{time.time() - T0:6.1f}s] {msg}", flush=True)


class Args:
    pass


def setup(name, res=(1080, 1080), frames=240, cam_loc=(0, -9, 0), lens=50, look_at=(0, 0, 0)):
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    a = Args()
    a.name = name
    a.frames = frames
    a.preview = int(argv[argv.index("--preview") + 1]) if "--preview" in argv else None
    a.render = "--render" in argv
    a.samples = int(argv[argv.index("--samples") + 1]) if "--samples" in argv else 48
    a.res_pct = int(argv[argv.index("--res") + 1]) if "--res" in argv else 100
    a.out = os.path.join(HERE, "renders", name)
    os.makedirs(a.out, exist_ok=True)

    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    a.sc = sc
    sc.render.engine = "CYCLES"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    dev = os.environ.get("ADAPT_DEVICE", "OPTIX")
    prefs.compute_device_type = dev
    prefs.get_devices()
    for d in prefs.devices:
        d.use = d.type == dev
    sc.cycles.device = "GPU"
    sc.cycles.samples = a.samples
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = "OPTIX" if dev == "OPTIX" else "OPENIMAGEDENOISE"
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.02
    sc.cycles.max_bounces = 8
    sc.cycles.transmission_bounces = 8
    sc.cycles.glossy_bounces = 4
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.render.use_persistent_data = True
    sc.render.resolution_x, sc.render.resolution_y = res
    sc.render.resolution_percentage = a.res_pct
    sc.render.fps = 30
    sc.frame_start, sc.frame_end = 0, frames - 1
    sc.view_settings.view_transform = "Standard"
    sc.view_settings.look = "None"

    # мир: камера видит чистый белый, отражения - белый + немного студии
    world = bpy.data.worlds.new("World"); sc.world = world
    world.use_nodes = True
    nt = world.node_tree; nt.nodes.clear()
    env = nt.nodes.new("ShaderNodeTexEnvironment")
    env.image = bpy.data.images.load(os.path.join(
        bpy.utils.system_resource("DATAFILES"), "studiolights", "world", "studio.exr"))
    tint = nt.nodes.new("ShaderNodeMix"); tint.data_type = "RGBA"
    tint.inputs["Factor"].default_value = 0.45
    tint.inputs["A"].default_value = (1, 1, 1, 1)
    bg_env = nt.nodes.new("ShaderNodeBackground")
    bg_white = nt.nodes.new("ShaderNodeBackground")
    bg_white.inputs[0].default_value = (1, 1, 1, 1)
    lp = nt.nodes.new("ShaderNodeLightPath")
    mix = nt.nodes.new("ShaderNodeMixShader")
    out = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(env.outputs[0], tint.inputs["B"])
    nt.links.new(tint.outputs["Result"], bg_env.inputs[0])
    nt.links.new(lp.outputs["Is Camera Ray"], mix.inputs[0])
    nt.links.new(bg_env.outputs[0], mix.inputs[1])
    nt.links.new(bg_white.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs[0])

    area("Key", (-4, -5, 5), 520, 5)
    area("Rim", (5, 4, 3), 700, 3, (0.75, 0.95, 1.0))
    area("Fill", (4, -6, -2), 110, 6)

    cd = bpy.data.cameras.new("Cam"); cd.lens = lens
    cam = bpy.data.objects.new("Cam", cd); sc.collection.objects.link(cam)
    cam.location = cam_loc
    d = Vector(look_at) - Vector(cam_loc)
    cam.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    sc.camera = cam
    a.cam = cam

    a.M = {
        "cyan": glossy("Cyan", CYAN, 0.22),
        "pearl": glossy("Pearl", PEARL, 0.25),
        "glass": glass("Glass", CYAN_DEEP, 0.08),
        "clear": glass("Clear", (0.85, 0.97, 1.0, 1), 0.04),
        "glow": emission("Glow", (0.0, 0.55, 0.85, 1), 2.2),
        "screen": emission("Screen", (0.95, 0.97, 0.98, 1), 1.0),
        "dark": glossy("Dark", (0.02, 0.03, 0.04, 1), 0.3),
        "line": glossy("Line", (0.55, 0.62, 0.66, 1), 0.5),
        "bubble": glossy("Bubble", (0.72, 0.93, 0.96, 1), 0.35),
    }
    return a


def area(name, loc, energy, size, color=(1, 1, 1)):
    l = bpy.data.lights.new(name, "AREA"); l.energy = energy; l.size = size; l.color = color
    o = bpy.data.objects.new(name, l); bpy.context.scene.collection.objects.link(o); o.location = loc
    o.rotation_euler = (Vector((0, 0, 0)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    return o


# ---------------------------------------------------------------- материалы
def glossy(name, color, rough):
    m = bpy.data.materials.new(name); m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = color
    p.inputs["Roughness"].default_value = rough
    p.inputs["Coat Weight"].default_value = 1.0
    p.inputs["Coat Roughness"].default_value = 0.05
    return m


def glass(name, color, rough):
    m = bpy.data.materials.new(name); m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = color
    p.inputs["Roughness"].default_value = rough
    p.inputs["IOR"].default_value = 1.45
    p.inputs["Transmission Weight"].default_value = 1.0
    p.inputs["Coat Weight"].default_value = 0.4
    return m


def emission(name, color, strength):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs[0].default_value = color; e.inputs[1].default_value = strength
    o = nt.nodes.new("ShaderNodeOutputMaterial")
    nt.links.new(e.outputs[0], o.inputs[0])
    return m


# ---------------------------------------------------------------- геометрия
def link(ob, mat=None, smooth=True, parent=None):
    bpy.context.scene.collection.objects.link(ob) if ob.name not in bpy.context.scene.collection.objects else None
    if mat is not None:
        ob.data.materials.clear(); ob.data.materials.append(mat)
    if smooth and ob.type == "MESH":
        for f in ob.data.polygons:
            f.use_smooth = True
    if parent is not None:
        ob.parent = parent
    return ob


def empty(name, loc=(0, 0, 0), parent=None):
    e = bpy.data.objects.new(name, None); bpy.context.scene.collection.objects.link(e)
    e.location = loc
    if parent is not None:
        e.parent = parent
    return e


def rbox(name, size, radius, mat, loc=(0, 0, 0), parent=None, segments=6):
    """Скруглённый параллелепипед: size = полные размеры (x, y, z)."""
    me = bpy.data.meshes.new(name)
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= size[0]; v.co.y *= size[1]; v.co.z *= size[2]
    bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); ob.location = loc
    link(ob, mat, parent=parent)
    r = min(radius, min(size) * 0.499)
    bv = ob.modifiers.new("Bevel", "BEVEL"); bv.width = r; bv.segments = segments
    return ob


def sphere(name, r, mat, loc=(0, 0, 0), parent=None):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=48, v_segments=24, radius=r)
    bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); ob.location = loc
    return link(ob, mat, parent=parent)


def torus(name, R, r, mat, loc=(0, 0, 0), rot=(0, 0, 0), parent=None):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    nu, nv = 128, 16
    grid = []
    for i in range(nu):
        u = TAU * i / nu
        row = []
        for j in range(nv):
            v = TAU * j / nv
            row.append(bm.verts.new(((R + r * math.cos(v)) * math.cos(u), (R + r * math.cos(v)) * math.sin(u), r * math.sin(v))))
        grid.append(row)
    for i in range(nu):
        for j in range(nv):
            bm.faces.new((grid[i][j], grid[(i + 1) % nu][j], grid[(i + 1) % nu][(j + 1) % nv], grid[i][(j + 1) % nv]))
    bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); ob.location = loc; ob.rotation_euler = rot
    return link(ob, mat, parent=parent)


def cone(name, r1, r2, depth, mat, loc=(0, 0, 0), parent=None):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=64, radius1=r1, radius2=r2, depth=depth)
    bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); ob.location = loc
    link(ob, mat, parent=parent)
    bv = ob.modifiers.new("Bevel", "BEVEL"); bv.width = min(r1, r2, depth) * 0.3 + 0.01; bv.segments = 5
    bv.limit_method = "ANGLE"
    return ob


def softmin(a, b, k):
    return -k * math.log(math.exp(-a / k) + math.exp(-b / k))


def star_outline(n, p=3.6, tip=0.95, k=0.03):
    pts = []
    for i in range(n):
        t = TAU * i / n
        c, s = math.cos(t), math.sin(t)
        x = math.copysign(abs(c) ** p, c); z = math.copysign(abs(s) ** p, s)
        r = math.hypot(x, z); r2 = softmin(r, tip, k)
        f = r2 / r if r > 1e-9 else 1
        pts.append((x * f, z * f))
    return pts


def puffy(name, outline, size, depth, mat, puff=0.35, rings=40, loc=(0, 0, 0), parent=None):
    """Объёмная «подушка» по замкнутому контуру в плоскости XZ (контур звёздный относительно 0)."""
    n = len(outline)
    bm = bmesh.new(); grid = []
    for j in range(1, rings):
        phi = -math.pi / 2 + math.pi * j / rings
        k = math.cos(phi) ** puff
        y = depth * math.sin(phi)
        grid.append([bm.verts.new((x * k * size, y, z * k * size)) for x, z in outline])
    top = bm.verts.new((0, depth, 0)); bot = bm.verts.new((0, -depth, 0))
    for j in range(len(grid) - 1):
        A, B = grid[j], grid[j + 1]
        for i in range(n):
            bm.faces.new((A[i], A[(i + 1) % n], B[(i + 1) % n], B[i]))
    for i in range(n):
        bm.faces.new((grid[0][(i + 1) % n], grid[0][i], bot))
        bm.faces.new((grid[-1][i], grid[-1][(i + 1) % n], top))
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); ob.location = loc
    link(ob, mat, parent=parent)
    ob.modifiers.new("Subd", "SUBSURF").levels = 1
    return ob


def star(name, size, depth, mat, loc=(0, 0, 0), parent=None):
    return puffy(name, star_outline(256), size, depth, mat, loc=loc, parent=parent)


def tube(name, pts, radius, mat, parent=None):
    cu = bpy.data.curves.new(name, "CURVE"); cu.dimensions = "3D"
    cu.bevel_depth = radius; cu.bevel_resolution = 6; cu.use_fill_caps = True
    sp = cu.splines.new("POLY"); sp.points.add(len(pts) - 1)
    for p, c in zip(sp.points, pts):
        p.co = (c[0], c[1], c[2], 1)
    ob = bpy.data.objects.new(name, cu)
    bpy.context.scene.collection.objects.link(ob)
    cu.materials.append(mat)
    if parent is not None:
        ob.parent = parent
    return ob


def bezier(p0, p1, p2, p3, n=64):
    out = []
    for i in range(n + 1):
        t = i / n; u = 1 - t
        out.append(tuple(u**3 * a + 3 * u * u * t * b + 3 * u * t * t * c + t**3 * d for a, b, c, d in zip(p0, p1, p2, p3)))
    return out


def sample(path, t):
    """Точка на ломаной path при t in [0, 1]."""
    t = min(max(t, 0.0), 1.0) * (len(path) - 1)
    i = min(int(t), len(path) - 2); f = t - i
    return tuple(a + (b - a) * f for a, b in zip(path[i], path[i + 1]))


def check_mark(name, size, thick, mat, loc=(0, 0, 0), parent=None):
    """Галочка из двух скруглённых брусков в плоскости XZ."""
    root = empty(name, loc, parent)
    vx, vz = -size * 0.12, -size * 0.28
    l1, l2 = size * 0.45, size * 0.85
    d1 = (-math.cos(math.radians(45)), math.sin(math.radians(45)))
    d2 = (math.cos(math.radians(52)), math.sin(math.radians(52)))
    a = rbox(name + "_a", (l1 + thick, thick, thick), thick * 0.5, mat,
             (vx + d1[0] * l1 / 2, 0, vz + d1[1] * l1 / 2), root)
    a.rotation_euler = (0, math.radians(45), 0)
    b = rbox(name + "_b", (l2 + thick, thick, thick), thick * 0.5, mat,
             (vx + d2[0] * l2 / 2, 0, vz + d2[1] * l2 / 2), root)
    b.rotation_euler = (0, math.radians(-52), 0)
    return root


# ---------------------------------------------------------------- иконки модулей (≈ 1 единица в поперечнике)
def icon_funnel(name, M, loc=(0, 0, 0), parent=None):
    root = empty(name, loc, parent)
    cone(name + "_cone", 0.08, 0.46, 0.55, M["cyan"], (0, 0, 0.12), root)
    rbox(name + "_spout", (0.12, 0.12, 0.3), 0.05, M["cyan"], (0, 0, -0.25), root)
    torus(name + "_rim", 0.46, 0.035, M["pearl"], (0, 0, 0.395), parent=root)
    return root


def icon_box(name, M, loc=(0, 0, 0), parent=None):
    root = empty(name, loc, parent)
    rbox(name + "_body", (0.7, 0.7, 0.6), 0.08, M["pearl"], (0, 0, 0), root)
    rbox(name + "_tape", (0.18, 0.72, 0.62), 0.03, M["cyan"], (0, 0, 0), root)
    return root


def icon_task(name, M, loc=(0, 0, 0), parent=None):
    root = empty(name, loc, parent)
    rbox(name + "_card", (0.62, 0.1, 0.78), 0.07, M["pearl"], (0, 0, 0), root)
    check_mark(name + "_check", 0.42, 0.08, M["cyan"], (0, -0.08, 0.02), root)
    return root


def icon_person(name, M, loc=(0, 0, 0), parent=None):
    root = empty(name, loc, parent)
    sphere(name + "_head", 0.17, M["cyan"], (0, 0, 0.24), root)
    rbox(name + "_body", (0.56, 0.36, 0.36), 0.17, M["cyan"], (0, 0, -0.18), root)
    return root


def icon_chart(name, M, loc=(0, 0, 0), parent=None):
    root = empty(name, loc, parent)
    rbox(name + "_base", (0.78, 0.3, 0.06), 0.03, M["pearl"], (0, 0, -0.33), root)
    for i, h in enumerate((0.3, 0.48, 0.66)):
        rbox(f"{name}_bar{i}", (0.17, 0.17, h), 0.06, M["cyan"], (-0.24 + 0.24 * i, 0, -0.3 + h / 2), root)
    return root


ICONS = {"funnel": icon_funnel, "box": icon_box, "task": icon_task, "person": icon_person, "chart": icon_chart}


# ---------------------------------------------------------------- анимация
def ease_back(x, s=1.70158):
    x = min(max(x, 0.0), 1.0) - 1
    return x * x * ((s + 1) * x + s) + 1


def smooth(x):
    x = min(max(x, 0.0), 1.0)
    return x * x * (3 - 2 * x)


def animate(a, fn, objs):
    """fn(t) выставляет location/rotation/scale для objs; t in [0, 1), кадры 0..frames."""
    sc = a.sc
    for f in range(a.frames + 1):
        fn(f / a.frames)
        for o in objs:
            o.keyframe_insert("location", frame=f)
            o.keyframe_insert("rotation_euler", frame=f)
            o.keyframe_insert("scale", frame=f)


def finish(a):
    mark("scene built")
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, f"{a.name}.blend"))
    sc = a.sc
    if a.preview is not None:
        sc.frame_set(a.preview)
        sc.render.filepath = os.path.join(a.out, f"preview_{a.preview:03d}.png")
        bpy.ops.render.render(write_still=True)
        mark("preview rendered")
    elif a.render:
        sc.render.image_settings.file_format = "PNG"
        sc.render.filepath = os.path.join(a.out, "frames", "f_")
        sc.render.use_overwrite = False      # дорендер после обрыва: готовые кадры пропускаются
        bpy.ops.render.render(animation=True)
        mark("animation rendered")
