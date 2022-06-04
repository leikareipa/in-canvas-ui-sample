/*
 * 2022 Tarpeeksi Hyvae Soft
 * 
 */

import {Wray} from "./wray.js";

const canvasEl = document.querySelector("#canvas");

export function closest_triangle_to_cursor() {
    const screenSpacePolys = Rngon.internalState.ngonCache.ngons;

    const ray = Wray.ray(
        Wray.vector3(window.mouseX, window.mouseY, Number.MAX_SAFE_INTEGER),
        Wray.vector3(0, 0, -1),
    );

    const closest = {
        distance: Infinity,
        polygon: undefined,
    };

    for (const poly of screenSpacePolys) {
        const polyParts = [];

        // Rudimentary triangulation.
        if (poly.vertices.length === 3) {
            polyParts.push(poly);
        }
        else if (poly.vertices.length === 4) {
            const p1 = Rngon.ngon([
                poly.vertices[0],
                poly.vertices[1],
                poly.vertices[2],
            ]);
            const p2 = Rngon.ngon([
                poly.vertices[0],
                poly.vertices[2],
                poly.vertices[3],
            ]);
            p1.material = p2.material = poly.material;
            polyParts.push(p1, p2);
        }
        else {
            throw new Error("Only triangles and quads are supported.");
        }

        polyParts.forEach(p=>p.parent = poly);

        for (const part of polyParts) {
            const wrayVertices = part.vertices.map(v=>Wray.vertex(Wray.vector3(v.x, v.y, 0)));
            const wrayTri = Wray.triangle(wrayVertices);
            const [distance] = ray.intersect_triangle(wrayTri);
            
            if ((distance !== null) && (distance < closest.distance)) {
                closest.distance = distance;
                closest.polygon = part.parent;
            }
        }
    }

    return closest.polygon;
}

export function isComponentHovered(componentId = "") {
    return (closest_triangle_to_cursor()?.material?.auxiliary?.id == componentId);
}

window.onmousemove = function(event) {
    if (event.target === canvasEl) {
        window.mouseX = (event.clientX - canvasEl.getBoundingClientRect().left);
        window.mouseY = (event.clientY - canvasEl.getBoundingClientRect().top);
    }
}
