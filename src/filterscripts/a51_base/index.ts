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

import { ColorEnum } from "@/filterscripts/a51_base/enums/color";
import { GateStatusEnum } from "@/filterscripts/a51_base/enums/gate";
import { IA51Options } from "@/interfaces";

import { PlaySoundForPlayersInRange } from "@/utils/gl_common";

import {
  BaseGameText,
  Dynamic3DTextLabel,
  DynamicObject,
  I18n,
  IFilterScript,
  KeysEnum,
} from "omp-node-lib";

import { A51TextLabels, My3dTextLabelEvent } from "./label";
import { A51ObjectsFactory, gateInfo, MyDynamicObjectEvent } from "./object";

import zh_cn from "./locales/zh-CN.json";
import en_us from "./locales/en-US.json";
import { A51Player, A51PlayerEvent, playerEvent } from "./player";

let A51LandObject: DynamicObject | null = null;
let A51Fence: DynamicObject | null = null;
let A51Buildings: Array<DynamicObject> | null = null;

class Fs {
  private labelGates: Array<Dynamic3DTextLabel> = [];
  private i18n: I18n | null = null;
  constructor(private options: IA51Options) {
    this.options = options;
    this.load();
  }
  private load() {
    const { locales, defaultLocale } = this.options;
    this.i18n = new I18n(defaultLocale, { zh_cn, en_us });
    if (locales) this.i18n.addLocales(locales);

    this.registerEvent();
    this.loadStreamers();
    this.registerCommand();
    console.log("\n");
    console.log("  |---------------------------------------------------");
    console.log(`  |--- ${this.i18n.$t("a51.load.line-1")}`);
    console.log(`  |--  ${this.i18n.$t("a51.load.line-2")}`);
    console.log(`  |--  ${this.i18n.$t("a51.load.line-3")}`);
    console.log("  |---------------------------------------------------");
  }
  public unload() {
    this.unregisterEvent();
    this.unregisterCommand();
    this.unloadStreamers();
    console.log("  |---------------------------------------------------");
    console.log(`  |--- ${this.i18n?.$t("a51.unload.line-1")}`);
    console.log("  |---------------------------------------------------");
  }
  private removeBuilding(player: A51Player) {
    player.removeBuilding(16203, 199.344, 1943.79, 18.2031, 250.0);
    player.removeBuilding(16590, 199.344, 1943.79, 18.2031, 250.0);
    player.removeBuilding(16323, 199.336, 1943.88, 18.2031, 250.0);
    player.removeBuilding(16619, 199.336, 1943.88, 18.2031, 250.0);
    player.removeBuilding(1697, 228.797, 1835.34, 23.2344, 250.0);
    player.removeBuilding(16094, 191.141, 1870.04, 21.4766, 250.0);
  }
  private destroyValidObject(o: DynamicObject | Array<DynamicObject> | null) {
    if (o === null) return false;
    if (Array.isArray(o)) {
      o.forEach((v) => this.destroyValidObject(v));
      return true;
    }
    if (o.isValid()) {
      o.destroy();
      return true;
    }
    return false;
  }
  private log(msg: string) {
    if (this.options?.debug === false) return;
    console.log(msg);
  }
  private loadStreamers() {
    // event should before create
    new MyDynamicObjectEvent(playerEvent.getPlayersMap(), false);
    let nInstance, eInstance;
    ({
      A51LandObject,
      A51Fence,
      A51Buildings,
      A51NorthernGate: nInstance,
      A51EasternGate: eInstance,
    } = A51ObjectsFactory());

    A51LandObject.create();
    this.log(`  |--  ${this.i18n?.$t("a51.objects.created.land")}`);

    A51Fence.create();
    this.log(`  |--  ${this.i18n?.$t("a51.objects.created.fence")}`);

    A51Buildings.forEach((o) => o.create());
    this.log(`  |--  ${this.i18n?.$t("a51.objects.created.building")}`);

    (gateInfo.north.instance = nInstance).create();
    (gateInfo.east.instance = eInstance).create();
    this.log(`  |--  ${this.i18n?.$t("a51.objects.created.gate")}`);

    new My3dTextLabelEvent(false, this.i18n);

    playerEvent.getPlayersArr().forEach((p) => {
      if (!p.isConnected() || p.isNpc()) return;
      this.removeBuilding(p);
    });

    this.log("  |---------------------------------------------------");
  }
  private unloadStreamers() {
    if (this.destroyValidObject(A51LandObject)) {
      this.log("  |---------------------------------------------------");
      this.log(`  |--  ${this.i18n?.$t("a51.objects.destroyed.land")}`);
    }

    if (this.destroyValidObject(A51Fence)) {
      this.log(`  |--  ${this.i18n?.$t("a51.objects.destroyed.fence")}`);
    }

    if (this.destroyValidObject(gateInfo.north.instance)) {
      this.log(
        `  |--  ${this.i18n?.$t("a51.objects.destroyed.gate.northern")}`
      );
    }

    if (this.destroyValidObject(gateInfo.east.instance)) {
      this.log(`  |--  ${this.i18n?.$t("a51.objects.destroyed.gate.eastern")}`);
    }

    A51Buildings?.forEach((o, i) => {
      if (this.destroyValidObject(o)) {
        this.log(
          `  |--  ${this.i18n?.$t("a51.objects.destroyed.building", [i + 1])}`
        );
      }
    });

    this.labelGates.forEach((t) => t.isValid() && t.destroy());
    this.log(`  |--  ${this.i18n?.$t("a51.labels.destroyed")}`);
  }
  private registerEvent() {
    playerEvent.onConnect = (p) => {
      this.removeBuilding(p);
      this.labelGates = A51TextLabels(gateInfo, p, this.i18n);
      this.labelGates.forEach((t) => {
        t.create()?.toggleCallbacks();
      });
      this.log(`  |--  ${this.i18n?.$t("a51.labels.created")}`);
      return 1;
    };
    playerEvent.onKeyStateChange = (p, newKeys) => {
      this.moveGate(playerEvent, p, newKeys as KeysEnum);
      return 1;
    };
  }
  private unregisterEvent() {
    playerEvent.onConnect = playerEvent.onKeyStateChange = undefined;
  }
  private registerCommand() {
    const { command = "a51", onTeleport } = this.options;
    playerEvent.onCommandText(command, (p) => {
      p.setInterior(0);
      p.setPos(135.2, 1948.51, 19.74);
      p.setFacingAngle(180);
      p.setCameraBehind();
      if (onTeleport) onTeleport(p);
      else
        new BaseGameText(
          `~b~~h~${this.i18n?.$t("a51.text.teleport", null, p.locale)}`,
          3000,
          3
        ).forPlayer(p);
      return 1;
    });
  }
  private unregisterCommand() {
    const { command = "a51" } = this.options;
    playerEvent.offCommandText(command);
  }
  private moveGate(
    playerEvent: A51PlayerEvent,
    player: A51Player,
    newkeys: KeysEnum
  ): void {
    if (!(newkeys & KeysEnum.YES)) return;
    const { beforeMoveGate, onGateOpen, onGateClose } = this.options;
    if (beforeMoveGate) {
      const res = beforeMoveGate(player);
      if (!res) return;
    }
    const direction = this.whichDoor(player);
    if (!direction) return;

    const {
      status,
      labelPos: position,
      openPos,
      closePos,
    } = gateInfo[direction];

    const doorLowName = this.i18n?.$t(
      "a51.objects.gate.status.waiting.open",
      null,
      player.locale
    );

    const { onGateMoving } = this.options;

    if (status === GateStatusEnum.OPENING) {
      if (onGateMoving) {
        onGateMoving(player, direction, status);
        return;
      }
      player.sendClientMessage(
        ColorEnum.MESSAGE_YELLOW,
        this.i18n?.$t(
          "a51.objects.gate.status.waiting.open",
          [doorLowName],
          player.locale
        ) || ""
      );
      return;
    }

    if (status === GateStatusEnum.CLOSING) {
      if (onGateMoving) {
        onGateMoving(player, direction, status);
        return;
      }
      player.sendClientMessage(
        ColorEnum.MESSAGE_YELLOW,
        this.i18n?.$t(
          "a51.objects.gate.status.waiting.close",
          [doorLowName],
          player.locale
        ) || ""
      );
      return;
    }

    PlaySoundForPlayersInRange(
      playerEvent.getPlayersArr(),
      1035,
      50.0,
      position.x,
      position.y,
      position.z
    );

    const {
      x: ox,
      y: oy,
      z: oz,
      speed: ospeed,
      rx: orx,
      ry: ory,
      rz: orz,
    } = openPos;

    const {
      x: cx,
      y: cy,
      z: cz,
      speed: cspeed,
      rx: crx,
      ry: cry,
      rz: crz,
    } = closePos;

    if (status === GateStatusEnum.CLOSED) {
      let openRes;
      if (onGateOpen) {
        openRes = onGateOpen(player, direction);
      } else {
        const gt = new BaseGameText(
          this.i18n?.$t(
            "a51.objects.gate.status.opening",
            [doorLowName],
            player.locale
          ) || "",
          3000,
          3
        );
        gt.forPlayer(player);
      }
      if (onGateOpen && !openRes) return;
      gateInfo[direction].instance?.move(ox, oy, oz, ospeed, orx, ory, orz);
      gateInfo[direction].status = GateStatusEnum.OPENING;
      return;
    }
    let closeRes;
    if (onGateClose) {
      closeRes = onGateClose(player, direction);
    } else {
      const gt = new BaseGameText(
        this.i18n?.$t(
          "a51.objects.gate.status.closing",
          [doorLowName],
          player.locale
        ) || "",
        3000,
        3
      );
      gt.forPlayer(player);
    }
    if (onGateClose && !closeRes) return;
    gateInfo[direction].instance?.move(cx, cy, cz, cspeed, crx, cry, crz);
    gateInfo[direction].status = GateStatusEnum.CLOSING;
    return;
  }
  private whichDoor(player: A51Player): "east" | "north" | void {
    const { x: ex, y: ey, z: ez } = gateInfo.east.labelPos;
    const { x: nx, y: ny, z: nz } = gateInfo.north.labelPos;
    if (player.isInRangeOfPoint(10.0, ex, ey, ez)) return "east";
    if (player.isInRangeOfPoint(10.0, nx, ny, nz)) return "north";
    return;
  }
}

export const useA51BaseFS = (options: IA51Options): IFilterScript => {
  let $fs: Fs | null = null;
  return {
    name: "a51_base",
    load() {
      $fs = new Fs(options);
    },
    unload() {
      if ($fs) $fs.unload();
    },
  };
};
