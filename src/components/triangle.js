/*
 * 2022 Tarpeeksi Hyvae Soft
 * 
 */

import {polygon} from "./polygon.js";

export function triangle(args = {}) {
    return polygon({
        ...args,
        vertices: [
            Rngon.vertex(-1, -1, 0),
            Rngon.vertex( 1, -1, 0),
            Rngon.vertex( 1,  1, 0),
        ],
    });
}
