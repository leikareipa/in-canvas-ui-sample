/*
 * 2022 Tarpeeksi Hyvae Soft
 * 
 */

import {isComponentHovered} from "./mouse-pick.js";

export function component({
    onClick = ()=>{},
    onEnter = ()=>{},
    onLeave = ()=>{},
    onUpdate = ()=>{},
} = {})
{
    let wasHovered = false;

    const self = {
        id: crypto.randomUUID(),
        update: function() {
            if (isComponentHovered(self.id)) {
                if (!wasHovered) {
                    self.onEnter();
                }
                wasHovered = true;
            }
            else if (wasHovered) {
                self.onLeave();
                wasHovered = false;
            }
            this.onUpdate();
        },
        onClick,
        onEnter,
        onLeave,
        onUpdate,
    };

    window.addEventListener("mousedown", ()=>{
        isComponentHovered(self.id) && self.onClick();
    });

    return self;
}
