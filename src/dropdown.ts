import * as toggles from 'htmlrapier/src/toggles';
/// <reference types="bootstrap" />

//Toggle Plugin
class DropdownStates extends toggles.ToggleStates {
    private drop: bootstrap.Dropdown;

    constructor(element: Element, next: toggles.IToggleStates) {
        super(next);
        this.drop = new bootstrap.Dropdown(element);
    }

    public activateState(state): boolean {
        //States not supported, handled by bootstrap
        return false; //Never fire any events for this toggle
    }
}

/**
 * Activate the dropdown htmlrapier plugin.
 */
export function activate() {
    toggles.addTogglePlugin(function (element, states, toggle) {
        if (element.classList.contains('dropdown-toggle')) {
            toggle = new DropdownStates(element, toggle);
        }

        return toggle;
    });
}