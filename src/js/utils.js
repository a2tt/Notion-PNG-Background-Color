/**
 * Register to call "fn" when ready, or call it right away when it is already
 * @param fn: function to call when ready
 */
export function onReadyCallback(fn) {
    if (document.readyState !== 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}
