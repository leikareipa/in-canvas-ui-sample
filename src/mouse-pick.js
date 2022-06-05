/*
 * 2022 Tarpeeksi Hyvae Soft
 * 
 */

const canvasEl = document.querySelector("#canvas");

export function closest_triangle_to_cursor() {
    const screenSpacePolys = Rngon.internalState.ngonCache.ngons;

    for (const poly of screenSpacePolys) {
        const polyParts = [poly];

        // Rudimentary triangulation.
        if (poly.vertices.length === 4) {
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
            polyParts.splice(0, Infinity, p1, p2);
        }
        else if (poly.vertices.length !== 3) {
            throw new Error("Only triangles and quads are supported.");
        }

        for (const part of polyParts) {
            const bc = get_barycentric_coords(part, window.mouseX, window.mouseY);

            // If the cursor is inside the triangle.
            if (bc.every(c=>c >= 0)) {
                return poly;
            }
        }
    }

    return undefined;
}

export function isComponentHovered(componentId = "") {
    return (closest_triangle_to_cursor()?.material?.auxiliary?.id == componentId);
}

// Adapted from code originally by Dmitry V. Sokolov (https://github.com/ssloy/tinyrenderer).
function get_barycentric_coords(triangle, x, y)
{
    const e1 = {
        x: (triangle.vertices[2].x - triangle.vertices[0].x),
        y: (triangle.vertices[1].x - triangle.vertices[0].x),
        z: (triangle.vertices[0].x - x),
    };

    const e2 = {
        x: (triangle.vertices[2].y - triangle.vertices[0].y),
        y: (triangle.vertices[1].y - triangle.vertices[0].y),
        z: (triangle.vertices[0].y - y),
    };
    
    const u = cross(e1, e2);
    const invZ = (1 / u.z);

    return [
        (1 - ((u.x + u.y) * invZ)),
        (u.y * invZ),
        (u.x * invZ),
    ];

    function cross(a, b)
    {
        return {
            x: ((a.y * b.z) - (a.z * b.y)),
            y: ((a.z * b.x) - (a.x * b.z)),
            z: ((a.x * b.y) - (a.y * b.x)),
        };
    }
}

window.onmousemove = function(event) {
    if (event.target === canvasEl) {
        window.mouseX = (event.clientX - canvasEl.getBoundingClientRect().left);
        window.mouseY = (event.clientY - canvasEl.getBoundingClientRect().top);
    }
}
