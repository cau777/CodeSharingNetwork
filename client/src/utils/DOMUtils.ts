import $ from "jquery";

function toggleClass(html: string, className: string) {
    $(html).hasClass(className) ? $(html).removeClass(className) : $(html).addClass(className);
}

// https://stackoverflow.com/questions/5353934/check-if-element-is-visible-on-screen
function checkVisible(element : HTMLElement) {
    let rect = element.getBoundingClientRect();
    let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

export {toggleClass, checkVisible};