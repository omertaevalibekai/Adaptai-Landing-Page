"""Карта ИИ-агентов: CEO-агент сверху, агенты отделов ниже, по связям бегут импульсы. Цикл 8 с."""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *  # noqa

a = setup("agents", res=(1080, 1080), frames=240, cam_loc=(0, -8.2, 1.0), lens=50, look_at=(0, 0, -0.3))
M = a.M

# CEO: стеклянный шар с искрой внутри
CEO = (0, 0, 1.55)
ceo = empty("CEO", CEO)
torus("CEO_ring", 0.62, 0.07, M["glass"], rot=(math.pi / 2, 0, 0), parent=ceo)
ceo_star = star("CEO_star", 0.42, 0.15, M["cyan"], parent=ceo)

# агенты отделов: стеклянные шары с иконками
DEPTS = [(-2.05, 0, -0.55, "funnel"), (0, 0, -0.75, "box"), (2.05, 0, -0.55, "person")]
depts, dept_icons = [], []
for i, (x, y, z, k) in enumerate(DEPTS):
    d = empty(f"D{i}", (x, y, z))
    torus(f"D{i}_ring", 0.5, 0.055, M["glass"], rot=(math.pi / 2, 0, 0), parent=d)
    ic = ICONS[k](f"D{i}_icon", M, parent=d)
    ic.scale = (0.68, 0.68, 0.68)
    depts.append(d); dept_icons.append(ic)

# под-агенты под продажами
SUBS = [(-2.75, 0, -2.2), (-1.35, 0, -2.2)]
subs = []
for i, p in enumerate(SUBS):
    s = empty(f"S{i}", p)
    sphere(f"S{i}_ball", 0.22, M["cyan"] if i == 0 else M["pearl"], parent=s)
    torus(f"S{i}_ring", 0.3, 0.035, M["glass"], rot=(math.pi / 2, 0, 0), parent=s)
    subs.append(s)


def link_path(p, q, bend=0.9):
    return bezier(p, (p[0], p[1], p[2] - bend), (q[0], q[1], q[2] + bend), q, 80)


paths = []
for x, y, z, _ in DEPTS:
    paths.append(link_path((CEO[0], CEO[1], CEO[2] - 0.69), (x, y, z + 0.555)))
for p in SUBS:
    paths.append(link_path((DEPTS[0][0], 0, DEPTS[0][2] - 0.555), (p[0], p[1], p[2] + 0.335), 0.5))
for i, pth in enumerate(paths):
    tube(f"Link{i}", pth, 0.03, M["pearl"])

# импульсы: по одному на связь, со сдвигом по времени
pulses = [sphere(f"P{i}", 0.1, M["glow"]) for i in range(len(paths))]
OFFS = [0.0, 0.12, 0.24, 0.42, 0.52]
DUR = 0.3


def bump(t, center, width=0.08):
    d = min(abs(t - center), 1 - abs(t - center))
    return max(0.0, 1 - d / width)


def pose(t):
    ceo.location = (CEO[0], CEO[1], CEO[2] + 0.05 * math.sin(TAU * t))
    ceo_star.rotation_euler = (0, -math.pi / 2 * t, 0)          # 90° за цикл - бесшовно
    ceo.scale = [1 + 0.05 * bump(t, 0.0)] * 3
    for i, (d, ic) in enumerate(zip(depts, dept_icons)):
        x, y, z, _ = DEPTS[i]
        d.location = (x, y, z + 0.06 * math.sin(TAU * t + i * 1.7))
        arrive = (OFFS[i] + DUR) % 1
        d.scale = [1 + 0.08 * bump(t, arrive)] * 3
        ic.rotation_euler = (math.radians(10), 0, math.radians(18) * math.sin(TAU * t + i))
    for i, s in enumerate(subs):
        x, y, z = SUBS[i]
        s.location = (x, y, z + 0.05 * math.sin(TAU * t + 2 + i))
        s.scale = [1 + 0.12 * bump(t, (OFFS[3 + i] + DUR) % 1)] * 3
    for i, (p, pth) in enumerate(zip(pulses, paths)):
        u = (t - OFFS[i]) % 1 / DUR
        if u <= 1:
            p.location = sample(pth, smooth(u))
            s = math.sin(math.pi * u) ** 0.5
            p.scale = (s, s, s)
        else:
            p.location = pth[0]
            p.scale = (0, 0, 0)


animate(a, pose, [ceo, ceo_star] + depts + dept_icons + subs + pulses)
finish(a)
