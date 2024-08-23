import * as toggles from 'htmlrapier/src/toggles';
/// <reference types="bootstrap" />

class LastClickTargetManager {
    private lastOnClickTarget: any = null;

    constructor() {
        window.addEventListener("click", evt => { this.lastOnClickTarget = evt.target }, true);
    }

    public getLast(): any {
        if (this.lastOnClickTarget) {
            //Get the last click target, and clear it out, we don't care about it after the first access
            var ret = this.lastOnClickTarget;
            this.lastOnClickTarget = null;
            return ret;
        }
        return null;
    }

    public refocus(element: any) {
        if (element) {
            element.focus();
        }
        else {
            //Return main element on page
            var target = null;
            var lookup = window.document.getElementsByTagName("main");
            if (lookup.length > 0) {
                target = lookup[0];
            }

            //Couldn't find anything, use current doc body.
            if (target === null) {
                target = window.document.body;
            }
            
            if (!target.hasAttribute("tabindex")) {
                target.setAttribute("tabindex", "-1");
            }
            (<any>target).focus();
        }
    }
}

var lastClickTracker: LastClickTargetManager;

//Toggle Plugin
class ModalStates extends toggles.ToggleStates {
    private modal: any;
    private lastOnClickBeforeOpen: any;

    constructor(element: Element, next: toggles.IToggleStates) {
        super(next);
        this.modal = new bootstrap.Modal(element);

        element.addEventListener('show.bs.modal', (e) => {
            this.lastOnClickBeforeOpen = lastClickTracker.getLast();
            this.fireStateChange('on');
        });
        element.addEventListener('hide.bs.modal', (e) => {
            this.fireStateChange('off');
        });
        //Only listen for tracking events if the modal is setup to do it.
        if (Boolean(element.getAttribute('data-hr-bootstrap-auto-refocus'))) {
            this.modal.on('hidden.bs.modal', (e) => {
                lastClickTracker.refocus(this.lastOnClickBeforeOpen);
            });
        }
        this.addState('on', 'on');
        this.addState('off', 'off');
    }

    public activateState(state): boolean {
        switch (state) {
            case 'on':
                this.modal.show();
                break;
            case 'off':
                this.modal.hide();
                break;
        }
        return false;
    }
}

/**
 * Activate all modal htmlrapier plugin.
 */
export function activate() {
    lastClickTracker = new LastClickTargetManager();

    toggles.addTogglePlugin(function (element, states, toggle) {
        if (element.classList.contains('modal')) {
            toggle = new ModalStates(element, toggle);
        }

        return toggle;
    });
}