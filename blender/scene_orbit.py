"""Орбита модулей: искра AdaptAI в центре, вокруг по кольцу летят иконки модулей. Цикл 12 с."""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *  # noqa

a = setup("orbit", res=(1920, 1080), frames=360, cam_loc=(0, -9.5, 2.3), lens=50, look_at=(0, 0, -0.1))
M = a.M

core = star("Core", 0.95, 0.32, M["cyan"])
ring = torus("Ring", 2.55, 0.028, M["glass"])

R = 2.55
kinds = ["funnel", "box", "task", "person", "chart"]
icons = [ICONS[k](f"I_{k}", M) for k in kinds]
for ic in icons:
    ic.scale = (0.62, 0.62, 0.62)


def pose(t):
    core.rotation_euler = (math.radians(12) * math.sin(TAU * t), -TAU * t / 4 * 2, math.radians(16) * math.sin(TAU * t + 1.2))
    core.location = (0, 0, 0.05 * math.sin(TAU * 2 * t))
    for i, ic in enumerate(icons):
        th = TAU * (i / len(icons)) - TAU * t - math.pi / 2
        x, y = R * math.cos(th), R * math.sin(th)
        ic.location = (x, y, 0.08 * math.sin(TAU * 2 * t + i))
        # иконка смотрит на зрителя, слегка покачивается
        ic.rotation_euler = (math.radians(8) * math.sin(TAU * t + i), 0, math.radians(14) * math.sin(TAU * t + i * 1.3))


# ядро: 4-кратная симметрия → за цикл поворот на 180° (кратно 90°) бесшовен
animate(a, pose, [core] + icons)
finish(a)
