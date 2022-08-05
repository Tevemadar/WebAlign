function sincos(x0, y0, x1, y1, x2, y2) {
    x1 -= x0;
    y1 -= y0;
    x2 -= x0;
    y2 -= y0;
    let l1 = Math.sqrt(x1 * x1 + y1 * y1);
    x1 /= l1;
    y1 /= l1;
    let l2 = Math.sqrt(x2 * x2 + y2 * y2);
    x2 /= l2;
    y2 /= l2;
    return[x1 * y2 - x2 * y1, x1 * x2 + y1 * y2];
}

function rot(v, a, b, sincos) {
    let x = v[a];
    let y = v[b];
    v[a] = x * sincos[1] - y * sincos[0];
    v[b] = x * sincos[0] + y * sincos[1];
}

function decomp(ouv, width, height) {
    if (typeof width === "undefined") {
        width = height = 1;
    }
    let u = 0;
    let v = 0;
    for (let i = 0; i < 3; i++) {
        ouv[i] += (ouv[i + 3] + ouv[i + 6]) / 2;
        u += ouv[i + 3] * ouv[i + 3];
        v += ouv[i + 6] * ouv[i + 6];
    }
    u = Math.sqrt(u);
    v = Math.sqrt(v);
    for (let i = 0; i < 3; i++) {
        ouv[i + 3] /= u;
        ouv[i + 6] /= v;
    }
    ouv.push(u / width, v / height);
}
function recomp(ouv, width, height) {
    if (typeof width === "undefined") {
        width = height = 1;
    }
    let v = ouv.pop() * height;
    let u = ouv.pop() * width;
    for (let i = 0; i < 3; i++) {
        ouv[i + 3] *= u;
        ouv[i + 6] *= v;
        ouv[i] -= (ouv[i + 3] + ouv[i + 6]) / 2;
    }
}

function normalize(arr, idx) {
    let len = 0;
    for (let i = 0; i < 3; i++)
        len += arr[idx + i] * arr[idx + i];
    len = Math.sqrt(len);
    for (let i = 0; i < 3; i++)
        arr[idx + i] /= len;
    return len;
}

function orthonormalize(ouv) {
    normalize(ouv, 3);
    let dot = 0;
    for (let i = 0; i < 3; i++)
        dot += ouv[i + 3] * ouv[i + 6];
    for (let i = 0; i < 3; i++)
        ouv[i + 6] -= ouv[i + 3] * dot;
    normalize(ouv, 6);
}

function LinInt(x1, y1, x2, y2) {
    this.get = function (x) {
        return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
    };
}

function LinReg() {
    let n = 0;
    let Sx = 0;
    let Sy = 0;
    let Sxx = 0;
    let Sxy = 0;
    let a, b;
    this.add = function (x, y) {
        n++;
        Sx += x;
        Sy += y;
        Sxx += x * x;
        Sxy += x * y;
        if (n >= 2) {
            b = (n * Sxy - Sx * Sy) / (n * Sxx - Sx * Sx);
            a = Sy / n - b * Sx / n;
        }
    };
    this.get = function (x) {
        return a + b * x;
    };
}

let len3 = (v, i = 0) => Math.sqrt(v[i] * v[i] + v[i + 1] * v[i + 1] + v[i + 2] * v[i + 2]);
let cross = (u, v) => [
        u[1] * v[2] - u[2] * v[1],
        u[2] * v[0] - u[0] * v[2],
        u[0] * v[1] - u[1] * v[0]
    ];
let dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
let deg = x => x * 180 / Math.PI;
let rad = x => x * Math.PI / 180;
let clamp = x => Math.max(-1, Math.min(1, x));
