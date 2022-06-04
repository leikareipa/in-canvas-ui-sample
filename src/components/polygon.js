/*
 * 2022 Tarpeeksi Hyvae Soft
 * 
 */

import {component} from "../component.js";

export function polygon({
    vertices = [],
    color = Rngon.color_rgba(0, 0, 0, 255),
    position = Rngon.translation_vector(0, 0, 0),
    rotation = Rngon.rotation_vector(0, 0, 0),
    scale = Rngon.scaling_vector(1, 1, 1),
    onClick = function() {
        this.ngons.forEach(ngon=>ngon.material.hasFill = false);
    },
    onEnter = function() {
        this.ngons.forEach(ngon=>ngon.material.color = Rngon.color_rgba(180, 180, 180));
    },
    onLeave = function() {
        this.ngons.forEach(ngon=>ngon.material.color = color);
    },
    onUpdate = ()=>{},
} = {})
{
    const self = component();

    const ngon = Rngon.ngon(vertices, {
        color,
        allowAlphaReject: false,
        allowAlphaBlend: false,
        auxiliary: {
            id: self.id
        },
    });

    const mesh = Rngon.mesh([ngon], {
        scaling: scale,
        translation: position,
        rotation: rotation,
    });

    self.onClick = onClick.bind(mesh);
    self.onEnter = onEnter.bind(mesh);
    self.onLeave = onLeave.bind(mesh);
    self.onUpdate = onUpdate.bind(mesh);

    return function() {
        self.update();
        return mesh;
    };
}
