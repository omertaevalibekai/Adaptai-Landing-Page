"""Доступы под контролем: стеклянный щит с галочкой, вокруг по наклонной орбите летят ключи-роли. Цикл 8 с."""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *  # noqa

a = setup("shield", res=(1080, 1080), frames=240, cam_loc=(0, -10, 1.4), lens=50, look_at=(0, 0, 0))
M = a.M


def shield_outline(n=256):
    """Контур щита (x, z), центр внутри, звёздный относительно (0, 0)."""
    pts = []
    for i in range(n):
        th = TAU * i / n
        dx, dz = math.cos(th), math.sin(th)
        # ищем пересечение луча с контуром: |x| <= w(z), z in [-1.15, top(x)]
        lo, hi = 0.0, 3.0
        for _ in range(40):
            r = (lo + hi) / 2
            x, z = dx * r, dz * r
            top = 0.95 - 0.12 * (x / 0.9) ** 2          # верх слегка выгнут
            if z >= 0.05:
                w = 0.9
            else:                                          # низ сходится к острию
                u = (0.05 - z) / 1.2
                w = 0.9 * max(0.0, 1 - u ** 1.6)
            inside = (z <= top) and (z >= -1.15) and (abs(x) <= w)
            lo, hi = (r, hi) if inside else (lo, r)
        pts.append((dx * lo, dz * lo))
    return pts


shield = empty("Shield", (0, 0, 0))
puffy("ShieldBody", shield_outline(), 1.35, 0.34, M["cyan"], puff=0.3, parent=shield)
check_mark("Check", 1.05, 0.2, M["pearl"], (0.05, -0.4, 0.15), shield)


def key(name):
    root = empty(name)
    torus(name + "_ring", 0.17, 0.055, M["cyan"], rot=(math.pi / 2, 0, 0), parent=root).location = (-0.3, 0, 0)
    rbox(name + "_shaft", (0.5, 0.09, 0.09), 0.04, M["cyan"], (0.08, 0, 0), root)
    rbox(name + "_t1", (0.07, 0.08, 0.16), 0.03, M["cyan"], (0.22, 0, -0.1), root)
    rbox(name + "_t2", (0.07, 0.08, 0.11), 0.03, M["cyan"], (0.3, 0, -0.075), root)
    return root


keys = [key(f"Key{i}") for i in range(4)]
for k in keys:
    k.scale = (1.35, 1.35, 1.35)
R, TILT = 2.25, math.radians(16)


def pose(t):
    shield.rotation_euler = (0, 0, math.radians(14) * math.sin(TAU * t))
    shield.location = (0, 0, 0.06 * math.sin(TAU * t))
    for i, k in enumerate(keys):
        th = TAU * (i / 4) + math.pi / 2 * t * 2          # 4 одинаковых ключа: 180° за цикл - бесшовно
        x, y = R * math.cos(th), R * math.sin(th)
        k.location = (x, y * math.cos(TILT), y * math.sin(TILT) + 0.1)
        k.rotation_euler = (math.radians(20) * math.sin(2 * th), math.radians(-25), th + math.pi / 2)
        k.scale = (1.35, 1.35, 1.35)


animate(a, pose, [shield] + keys)
finish(a)
