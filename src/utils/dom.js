/*
 * @Author: yuxiaosong
 * @Date: 2021-01-15 11:55:01
 * @Last Modified by: yuxiaosong
 * @Last Modified time: 2021-01-15 11:55:01
 */

/**
 * @desc 是否为元素几点
 *
 * @param {DOMElement} ele 一个 DOM 元素
 * @return {Boolean}
 */
export const isElement = ele => ele && ele.nodeType === 1;

/**
 * @desc 获取 DOM CSS 属性的值
 *
 * @param {DOMElement} ele A DOM 元素
 * @returns {String}
 */
export function getStylePropValue(ele, prop) {
  return window.getComputedStyle(ele).getPropertyValue(prop);
}

/**
 * @desc 元素是否在可视区域可见
 *
 * @param {Object} rect 元素大小及相对可视区域的位置信息
 * @returns {Boolean} true => 可见 false => 不可见
 */
export function isInViewport(rect, viewport) {
  if (!rect || (rect.width <= 0 || rect.height <= 0)) {
    return false;
  }

  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < window.innerHeight &&
    rect.left < window.innerWidth &&
    !(
      rect.left > viewport.right ||
      rect.top > viewport.bottom ||
      rect.right < viewport.left ||
      rect.bottom < viewport.top
    )
  );
}

/**
 * @desc 元素是否隐藏
 *
 * @param {DOMElement} ele A DOM 元素
 * @returns {Boolean} true => 未隐藏可见  false => 隐藏不可见
 */
export function isVisible(ele) {
  if (ele === window.document) {
    return true;
  }
  if (!ele || !ele.parentNode) {
    return false;
  }

  const parent = ele.parentNode;
  const visibility = getStylePropValue(ele, "visibility");
  const display = getStylePropValue(ele, "display");

  if (visibility === "hidden" || display === "none") {
    return false;
  }
  return parent ? isVisible(parent) : true;
}
