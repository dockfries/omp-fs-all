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

import { COLOR } from "@/enums/color";
import { GATES } from "@/enums/gates";
import {
  addCbListener,
  removeCbListener,
  registeredCbs,
} from "@/utils/eventListener";
import { PlaySoundForPlayersInRange } from "@/utils/gl_common";

import {
  BaseGameText,
  BasePlayer,
  BasePlayerEvent,
  Dynamic3DTextLabel,
  DynamicObject,
  TCommonCallback,
  TFilterScript,
  DynamicObjectEvent,
  EditResponseTypesEnum,
  KeysEnum,
  BaseGameMode,
} from "omp-node-lib";
import { A51TextLabels } from "./label";
import { A51Objects } from "./object";

let NorthernGateStatus = GATES.CLOSED;
let EasternGateStatus = GATES.CLOSED;

let A51LandObject: DynamicObject | null = null;
let A51Fence: DynamicObject | null = null;
let A51Buildings: Array<DynamicObject> | null = null;
let A51NorthernGate: DynamicObject | null = null;
let A51EasternGate: DynamicObject | null = null;

class MyDynamicObjectEvent extends DynamicObjectEvent<
  BasePlayer,
  DynamicObject
> {
  protected onMoved(object: DynamicObject): TCommonCallback {
    if (object === A51NorthernGate) {
      NorthernGateStatus =
        NorthernGateStatus === GATES.CLOSING ? GATES.CLOSED : GATES.OPEN;
      return 1;
    }
    if (object === A51EasternGate) {
      EasternGateStatus =
        EasternGateStatus === GATES.CLOSING ? GATES.CLOSED : GATES.OPEN;
      return 1;
    }
    return 1;
  }
  //#region
  protected onPlayerEdit(
    player: BasePlayer,
    object: DynamicObject,
    response: EditResponseTypesEnum,
    x: number,
    y: number,
    z: number,
    rx: number,
    ry: number,
    rz: number
  ): TCommonCallback {
    return 1;
  }
  protected onPlayerSelect(
    player: BasePlayer,
    object: DynamicObject,
    modelid: number,
    x: number,
    y: number,
    z: number
  ): TCommonCallback {
    return 1;
  }
  protected onPlayerShoot(
    player: BasePlayer,
    weaponid: number,
    object: DynamicObject,
    x: number,
    y: number,
    z: number
  ): TCommonCallback {
    return 1;
  }

  //#endregion
}

export interface IA51Options<P extends BasePlayer> {
  playerEvent: BasePlayerEvent<P>;
  command?: string | Array<string>;
  debug?: boolean;
  charset?: string;
}
class Fs<P extends BasePlayer> {
  private GateNames: [string, string] = ["Northern Gate", "Eastern Gate"];
  private labelGates: Array<Dynamic3DTextLabel> = [];
  private options: IA51Options<P>;
  constructor(options: IA51Options<P>) {
    this.options = options;
    this.load();
  }
  private load() {
    const { charset = "utf8", playerEvent } = this.options;

    this.loadStreamers(playerEvent, charset);
    this.registerEvent(playerEvent);
    this.registerCommand();

    console.log("\n");
    console.log("  |---------------------------------------------------");
    console.log("  |--- Area 51 (69) Building Objects Filterscript");
    console.log("  |--  Script v1.01");
    console.log("  |--  28th March 2015");
    console.log("  |---------------------------------------------------");
  }
  public unload() {
    this.unregisterEvent();
    this.unregisterCommand();
    this.unloadStreamers();
    console.log("  |---------------------------------------------------");
    console.log("  |--  Area 51 (69) Base Objects Filterscript Unloaded");
    console.log("  |---------------------------------------------------");
  }
  private removeBuilding(player: P) {
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
  private loadStreamers(playerEvent: BasePlayerEvent<P>, charset: string) {
    ({
      A51LandObject,
      A51Fence,
      A51Buildings,
      A51NorthernGate,
      A51EasternGate,
    } = A51Objects(charset));

    A51LandObject.create();
    this.log("  |--  Area 51 (69) Land object created");

    A51Fence.create();
    this.log("  |--  Area 51 (69) Fence object created");

    A51Buildings.forEach((o) => o.create());
    this.log("  |--  Area 51 (69) Building objects created");

    A51NorthernGate.create();
    A51EasternGate.create();
    this.log("  |--  Area 51 (69) Gate objects created");

    this.labelGates = A51TextLabels(this.GateNames, charset);
    this.log("  |--  Area 51 (69) Gates 3D Text Labels created");
    this.log("  |---------------------------------------------------");

    playerEvent.getPlayersArr().forEach((p) => {
      if (!p.isConnected() || p.isNpc()) return;
      this.removeBuilding(p);
    });

    new MyDynamicObjectEvent(playerEvent.getPlayersMap());
  }
  private unloadStreamers() {
    if (this.destroyValidObject(A51LandObject)) {
      this.log("  |---------------------------------------------------");
      this.log("  |--  Area 51 (69) Land object destroyed");
    }

    if (this.destroyValidObject(A51Fence)) {
      this.log("  |--  Area 51 (69) Fence object destroyed");
    }

    if (this.destroyValidObject(A51NorthernGate)) {
      this.log("  |--  Area 51 (69) Northern Gate object destroyed");
    }

    if (this.destroyValidObject(A51EasternGate)) {
      this.log("  |--  Area 51 (69) Eastern Gate object destroyed");
    }

    A51Buildings?.forEach((o, i) => {
      if (this.destroyValidObject(o)) {
        this.log(`  |--  Area 51 (69) Building object ${i + 1} destroyed`);
      }
    });

    this.labelGates.forEach((t) => t.destroy());
    this.log("  |--  Deleted the 3D Text Labels on the Area 51 (69) Gates");
  }
  private registerEvent(playerEvent: BasePlayerEvent<P>) {
    const c_fn = (playerid: number) => {
      const p = playerEvent.findPlayerById(playerid);
      if (!p) return;
      this.removeBuilding(p);
      return 1;
    };
    addCbListener("OnPlayerConnect", c_fn);

    const ksc_fn = (playerid: number, newkeys: KeysEnum) => {
      const p = playerEvent.findPlayerById(playerid);
      if (!p) return;
      this.moveGate(playerEvent, p, newkeys);
      return 1;
    };
    addCbListener("OnPlayerKeyStateChange", ksc_fn);
  }
  private unregisterEvent() {
    registeredCbs.forEach((v) => removeCbListener(v[0], v[1]));
  }
  private registerCommand() {
    const { playerEvent, command = "a51" } = this.options;
    playerEvent.onCommandText(command, (p) => {
      p.setInterior(0);
      p.setPos(135.2, 1948.51, 19.74);
      p.setFacingAngle(180);
      p.setCameraBehind();
      new BaseGameText("~b~~h~Area 51 (69) Base!", 3000, 3).forPlayer(p);
      return 1;
    });
  }
  private unregisterCommand() {
    const { playerEvent, command = "a51" } = this.options;
    playerEvent.offCommandText(command);
  }
  private moveGate(
    playerEvent: BasePlayerEvent<P>,
    player: P,
    newkeys: KeysEnum
  ) {
    if (!(newkeys & KeysEnum.YES)) return;
    if (player.isInRangeOfPoint(10.0, 287.12, 1821.51, 18.14)) {
      if (EasternGateStatus === GATES.OPENING) {
        player.sendClientMessage(
          COLOR.MESSAGE_YELLOW,
          "* Sorry, you must wait for the eastern gate to fully open first."
        );
        return;
      }
      if (EasternGateStatus === GATES.CLOSING) {
        player.sendClientMessage(
          COLOR.MESSAGE_YELLOW,
          "* Sorry, you must wait for the eastern gate to fully close first."
        );
        return;
      }
      PlaySoundForPlayersInRange(
        playerEvent.getPlayersArr(),
        1035,
        50.0,
        287.12,
        1821.51,
        18.14
      );
      if (EasternGateStatus == GATES.CLOSED) {
        const gt = new BaseGameText("~b~~h~Eastern Gate Opening!", 3000, 3);
        gt.forPlayer(player);
        A51EasternGate?.move(286.008666, 1833.744628, 20.010623, 1.1, 0, 0, 90);
        EasternGateStatus = GATES.OPENING;
        return;
      }
      const gt = new BaseGameText("~b~~h~Eastern Gate Closing!", 3000, 3);
      gt.forPlayer(player);
      A51EasternGate?.move(286.008666, 1822.744628, 20.010623, 1.1, 0, 0, 90);
      EasternGateStatus = GATES.CLOSING;
      return;
    }

    if (player.isInRangeOfPoint(10.0, 135.09, 1942.37, 19.82)) {
      if (NorthernGateStatus == GATES.OPENING) {
        const msg =
          "* Sorry, you must wait for the northern gate to fully open first.";
        player.sendClientMessage(COLOR.MESSAGE_YELLOW, msg);
        return;
      }
      if (NorthernGateStatus == GATES.CLOSING) {
        const msg =
          "* Sorry, you must wait for the northern gate to fully close first.";
        player.sendClientMessage(COLOR.MESSAGE_YELLOW, msg);
        return;
      }

      PlaySoundForPlayersInRange(
        playerEvent.getPlayersArr(),
        1035,
        50.0,
        135.09,
        1942.37,
        19.82
      );
      if (NorthernGateStatus == GATES.CLOSED) {
        new BaseGameText("~b~~h~Northern Gate Opening!", 3000, 3).forPlayer(
          player
        );
        A51NorthernGate?.move(
          121.545074,
          1941.527709,
          21.691408,
          1.3,
          0,
          0,
          180
        );
        NorthernGateStatus = GATES.OPENING;
        return;
      }
      const gt = new BaseGameText("~b~~h~Northern Gate Closing!", 3000, 3);
      gt.forPlayer(player);
      A51NorthernGate?.move(134.545074, 1941.527709, 21.691408, 1.3, 0, 0, 180);
      NorthernGateStatus = GATES.CLOSING;
    }
  }
}

export type A51FilterScript<P extends BasePlayer> = TFilterScript & {
  load(gm: BaseGameMode, options: IA51Options<P>): void;
};

export const useA51BaseFS = <P extends BasePlayer>(): A51FilterScript<P> => {
  let $el: Fs<P> | null = null;
  return {
    name: "a51_base",
    load(gm: BaseGameMode, options: IA51Options<P>) {
      $el = new Fs(options);
    },
    unload() {
      if ($el) $el.unload();
    },
  };
};
