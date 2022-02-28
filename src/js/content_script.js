import {storageGetPromise} from "./storage";
import {onReadyCallback} from "./utils";
import * as constants from "./constants"

function createCss() {
    storageGetPromise([constants.KEY_COLOR]).then(items => {
        let color = items[constants.KEY_COLOR];

        if (color === undefined) return;

        let style = document.createElement('style');

        // Just use "img" tag
        style.innerHTML = `#notion-app .notion-page-content img{background-color:${color};}`;
        document.getElementsByTagName('head')[0].appendChild(style);

        // Apply to each "img" tag (however, should do workaround through CSR)
        // style.innerHTML = `.${constants.CSS_CLASS}{background-color:${color};}`;
        // let images = document.getElementsByTagName('img');
        // Array.prototype.forEach.call(images, item => {
        //     if (!item.classList.contains('notion-emoji')) {
        //         item.classList.toggle(constants.CSS_CLASS);
        //     }
        // })
    })
}

function apply() {
    // Only when Notion is set as a darkmode
    if (document.body.classList.contains('dark')) {
        createCss();
    }
}

(function () {
    onReadyCallback(apply);
})()
