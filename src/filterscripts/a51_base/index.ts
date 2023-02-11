/**
 * ------------------------------------------------------
 * Example Filterscript for the Area 51 (69) Base Objects
 * ------------------------------------------------------
 * By Matite in March 2015
 * 
 * This script removes the existing GTASA Area 51 (69) land section, fence and
 * buildings. It then replaces the land section and buildings with the new
 * enterable versions. It also replaces the perimeter fence and adds two
 * gates that can be opened or closed.
 * 
 * Warning...
 * This script uses a total of:
 * 11 objects = 1 for the replacement land object, 7 for the replacement
   building objects, 1 for the outer fence and 2 for the gates
 * Enables the /a51 command to teleport the player to the Area 51 (69) Base
 * 2 3D Text Labels = 1 on each gate
 */

import { IA51Options } from "@/interfaces";

import {
  BaseGameText,
  Dynamic3DTextLabel,
  I18n,
  IFilterScript,
} from "omp-node-lib";

import { A51TextLabels, My3dTextLabelEvent } from "./label";
import {
  gateInfo,
  loadObjects,
  moveGate,
  removeBuilding,
  unloadObjects,
} from "./object";

import zh_cn from "./locales/zh-CN.json";
import en_us from "./locales/en-US.json";
import { playerEvent } from "./player";
import { log } from "@/utils/gl_common";

export const useA51BaseFS = (options: IA51Options): IFilterScript => {
  let labelGates: Array<Dynamic3DTextLabel> = [];
  const { locales, defaultLocale } = options;
  const i18n = new I18n(defaultLocale, { zh_cn, en_us });
  if (locales) i18n.addLocales(locales);

  const loadStreamers = () => {
    loadObjects(options, i18n);
    new My3dTextLabelEvent(false, i18n);
    log(options, "  |---------------------------------------------------");
  };

  const unloadStreamers = () => {
    unloadObjects(options, i18n);
    labelGates.forEach((t) => t.isValid() && t.destroy());
    log(options, `  |--  ${i18n?.$t("a51.labels.destroyed")}`);
  };

  const registerEvent = () => {
    playerEvent.onConnect = (p) => {
      removeBuilding(p);
      labelGates = A51TextLabels(gateInfo, p, i18n);
      labelGates.forEach((t) => t.create()?.toggleCallbacks());
      log(options, `  |--  ${i18n?.$t("a51.labels.created")}`);
      return 1;
    };
    playerEvent.onKeyStateChange = (p, newKeys) => {
      moveGate(playerEvent, p, newKeys, options, i18n);
      return 1;
    };
  };

  const unregisterEvent = () => {
    playerEvent.onConnect = playerEvent.onKeyStateChange = undefined;
  };

  const registerCommand = () => {
    const { command = "a51", onTeleport } = options;
    playerEvent.onCommandText(command, (p) => {
      p.setInterior(0);
      p.setPos(135.2, 1948.51, 19.74);
      p.setFacingAngle(180);
      p.setCameraBehind();
      if (onTeleport) onTeleport(p);
      else
        new BaseGameText(
          `~b~~h~${i18n?.$t("a51.text.teleport", null, p.locale)}`,
          3000,
          3
        ).forPlayer(p);
      return 1;
    });
  };

  const unregisterCommand = () => {
    const { command = "a51" } = options;
    playerEvent.offCommandText(command);
  };

  const devideLine = () => {
    console.log("  |---------------------------------------------------");
  };

  return {
    name: "a51_base",
    load() {
      registerEvent();
      loadStreamers();
      registerCommand();

      console.log("\n");
      devideLine();
      console.log(`  |--- ${i18n.$t("a51.load.line-1")}`);
      console.log(`  |--  ${i18n.$t("a51.load.line-2")}`);
      console.log(`  |--  ${i18n.$t("a51.load.line-3")}`);
      devideLine();
    },
    unload() {
      unregisterEvent();
      unregisterCommand();
      unloadStreamers();

      devideLine();
      console.log(`  |--- ${i18n?.$t("a51.unload.line-1")}`);
      devideLine();
    },
  };
};
