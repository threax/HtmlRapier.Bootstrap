import * as modal from './modal';
import * as dropdown from './dropdown';
import * as tab from './tab';
import * as bootstrap from 'bootstrap';

modal.activate();
dropdown.activate();
tab.activate();

export function setup() {
    //Does not do anything, but makes module work
    return true;
}