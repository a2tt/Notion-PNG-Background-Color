import '../css/reset.css'
import '../css/popup.css'

import * as constants from './constants';
import {storageSetPromise, storageGetPromise} from "./storage";

let hexPattern = /#[0-9a-fA-F]{6}/;

let colorPicker = document.getElementById('bg-color');
let sample = document.getElementsByClassName('sample')[0];
let resetBtn = document.getElementsByClassName('reset-btn')[0];

let debounceSave = null;

/**
 * Set passed color as sample background color
 * @param color: selected color to show
 * @param save: save if true, otherwise nothing
 */
function applySampleColor(color, save) {
    console.log(color)
    if (hexPattern.test(color)) {
        sample.style.backgroundColor = color;

        if (save) {
            clearTimeout(debounceSave);
            debounceSave = setTimeout(() => {
                saveColor(color);
            }, constants.SAVE_DEBOUNCE)
        }
    }
}

/**
 * Load color from the localstorage
 */
function loadColor() {
    storageGetPromise([constants.KEY_COLOR]).then(items => {
        let color = items[constants.KEY_COLOR] || "#ffffff"; // white if transparent
        colorPicker.value = color;
        applySampleColor(color, false);
    })
}

/**
 * Save color to the localstorage
 * @param color
 */
function saveColor(color) {
    storageSetPromise({[constants.KEY_COLOR]: color}).then(() => {
        console.log('saved')
    })
}

function resetColor() {
    saveColor(null);
    loadColor();
}

function colorPickerOnChange(e) {
    let newHex = e.target.value;
    applySampleColor(newHex, true);
}

(function () {
    loadColor();
    colorPicker.addEventListener("input", colorPickerOnChange);
    resetBtn.addEventListener('click', resetColor);
})()
