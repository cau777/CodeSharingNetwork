/**
 * @summary Checks whether an element is currently visible on screen
 * @link https://stackoverflow.com/questions/5353934/check-if-element-is-visible-on-screen
 * @param element The element to check
 */
function checkVisible(element: HTMLElement) {
    let rect = element.getBoundingClientRect();
    let viewHeight = Math.max(getDocumentHeight(), window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

/**
 * @summary Cross-browser solution to find the total document height
 */
function getDocumentHeight() {
    return Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight,
        document.documentElement.scrollHeight, document.documentElement.offsetHeight);
}

export {checkVisible, getDocumentHeight};