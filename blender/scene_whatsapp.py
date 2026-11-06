"""Сводка дня в WhatsApp: телефон, на экране по очереди появляются сообщения
(сделки, задачи, график). Без текста - понятно на любом языке. Цикл 8 с."""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import *  # noqa

a = setup("whatsapp", res=(1080, 1080), frames=240, cam_loc=(0, -6.7, 0.5), lens=50, look_at=(0, 0, 0))
M = a.M
W, H = 1.95, 3.9            # телефон

phone = empty("Phone", (0, 0, 0))
rbox("Body", (W, 0.2, H), 0.26, M["cyan"], parent=phone)
rbox("Bezel", (W - 0.1, 0.05, H - 0.1), 0.22, M["dark"], (0, -0.09, 0), phone)
rbox("Screen", (W - 0.22, 0.03, H - 0.22), 0.16, M["screen"], (0, -0.11, 0), phone)
rbox("Island", (0.5, 0.02, 0.12), 0.06, M["dark"], (0, -0.13, H / 2 - 0.3), phone)
# шапка чата
rbox("Header", (W - 0.22, 0.02, 0.42), 0.02, M["bubble"], (0, -0.13, H / 2 - 0.58), phone)
sphere("Avatar", 0.12, M["cyan"], (-W / 2 + 0.35, -0.15, H / 2 - 0.58), phone)
rbox("HeaderLine", (0.6, 0.02, 0.07), 0.035, M["line"], (-W / 2 + 0.85, -0.15, H / 2 - 0.58), phone)

SW = W - 0.5
bubbles = []


def bubble(name, z, h, side=-1):
    b = empty(name, (0, -0.15, z), phone)
    bw = SW * 0.86
    rbox(name + "_bg", (bw, 0.04, h), 0.12, M["bubble"] if side < 0 else M["pearl"], parent=b)
    b["x0"] = side * (SW - bw) / 2
    b.location.x = b["x0"]
    return b, bw


# 1. итог по сделкам: три строки + крупная цифра-плашка
b1, bw = bubble("B1", 0.95, 0.9)
rbox("B1_kpi", (0.55, 0.03, 0.2), 0.1, M["cyan"], (-bw / 2 + 0.38, -0.04, 0.22), b1)
for i, w in enumerate((0.95, 0.7, 0.82)):
    rbox(f"B1_l{i}", (w, 0.03, 0.065), 0.032, M["line"], (-bw / 2 + 0.12 + w / 2, -0.04, -0.03 - 0.15 * i), b1)
bubbles.append(b1)

# 2. задачи: три строки с галочками
b2, bw = bubble("B2", -0.12, 0.88)
for i in range(3):
    zz = 0.25 - 0.25 * i
    sphere(f"B2_dot{i}", 0.075, M["cyan"], (-bw / 2 + 0.2, -0.05, zz), b2)
    rbox(f"B2_l{i}", (0.9 - 0.15 * i, 0.03, 0.065), 0.032, M["line"], (-bw / 2 + 0.36 + (0.9 - 0.15 * i) / 2, -0.04, zz), b2)
bubbles.append(b2)

# 3. мини-график
b3, bw = bubble("B3", -1.13, 0.8)
for i, h in enumerate((0.22, 0.34, 0.28, 0.46, 0.58)):
    rbox(f"B3_bar{i}", (0.16, 0.05, h), 0.06, M["cyan"], (-bw / 2 + 0.25 + 0.24 * i, -0.04, -0.3 + h / 2), b3)
bubbles.append(b3)

# значок уведомления
badge = sphere("Badge", 0.16, M["pearl"], (W / 2 - 0.05, -0.2, H / 2 - 0.05))
badge.parent = phone

APPEAR = [0.12, 0.27, 0.42]
HIDE = 0.86


def pose(t):
    phone.rotation_euler = (math.radians(8) * math.sin(TAU * t), math.radians(4) * math.sin(TAU * t + 1), math.radians(-24 + 8 * math.sin(TAU * t)))
    phone.location = (0, 0, 0.08 * math.sin(TAU * t))
    out = smooth((t - HIDE) / 0.1)
    for b, t0 in zip(bubbles, APPEAR):
        s = ease_back((t - t0) / 0.1) * (1 - out)
        s = max(s, 0.0)
        b.scale = (s, s, s)
        b.location.z = b.location.z  # без смещения по высоте
    bs = ease_back((t - 0.05) / 0.08) * (1 - out)
    badge.scale = [max(bs, 0.0)] * 3


animate(a, pose, [phone, badge] + bubbles)
finish(a)
