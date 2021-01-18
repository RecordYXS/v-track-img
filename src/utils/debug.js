/*
 * @Author: yuxiaosong
 * @Date: 2021-01-15 11:55:01
 * @Last Modified by: yuxiaosong
 * @Last Modified time: 2021-01-15 11:55:01
 */
import { isFun } from "./helper";

export const checkFun = fn => {
  if (!isFun(fn)) {
    throw new Error("The first parameter should be Function.");
  }
};
