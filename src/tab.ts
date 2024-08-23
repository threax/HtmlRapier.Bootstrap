import * as toggles from 'htmlrapier/src/toggles';
import * as bootstrap from './bootstrap';

//Toggle Plugin
class TabStates extends toggles.ToggleStates {
    private tab: bootstrap.Tab;

    constructor(element: Element, next: toggles.IToggleStates) {
        super(next);
        this.tab = new bootstrap.Tab(element);

        element.addEventListener('shown.bs.tab', (e) => {
            this.fireStateChange('on');
        });
        element.addEventListener('hide.bs.tab', (e) => {
            this.fireStateChange('off');
        });
        this.addState('on', 'on');
        this.addState('off', 'off');
    }

    public activateState(state): boolean {
        switch (state) {
            case 'on':
                this.tab.show();
                break;
            case 'off':
                //Can't turn off tabs, does nothing
                break;
        }
        return false;
    }
}

/**
 * Activate all modal htmlrapier plugin.
 */
export function activate() {
    toggles.addTogglePlugin(function (element, states, toggle) {
        if (element.getAttribute("data-toggle") === 'tab') {
            toggle = new TabStates(element, toggle);
        }

        return toggle;
    });
}