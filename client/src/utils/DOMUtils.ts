import $ from "jquery";

function toggleClass(html: string, className: string) {
    $(html).hasClass(className) ? $(html).removeClass(className) : $(html).addClass(className);
}

export {toggleClass};