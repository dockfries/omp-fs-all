import { I18n, TLocales } from "omp-node-lib";
import zh_cn from "./locales/zh-CN.json";
import en_us from "./locales/en-US.json";

export const locales: TLocales = { zh_cn, en_us };

export const { $t, addLocales } = new I18n("en_us", locales);
