/**
 * @param {Array} key
 * @returns {Promise<Object>}
 */
export function storageGetPromise(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (res) => {
            resolve(res);
        });
    });
}

/**
 * @param {Object} obj
 * @returns {Promise<Object>}
 */
export function storageSetPromise(obj) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(obj, () => {
            resolve();
        })
    })
}
