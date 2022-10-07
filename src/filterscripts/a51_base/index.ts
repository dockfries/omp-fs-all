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

import { ColorEnum } from "@/enums/color";
import { GateStatusEnum } from "@/enums/gate";
import { A51FilterScript, IA51Options } from "@/interfaces";
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
  DynamicObjectEvent,
  EditResponseTypesEnum,
  KeysEnum,
} from "omp-node-lib";
import { A51TextLabels } from "./label";
import { A51ObjectsFactory, gateInfo } from "./object";

let A51LandObject: DynamicObject | null = null;
let A51Fence: DynamicObject | null = null;
let A51Buildings: Array<DynamicObject> | null = null;

class MyDynamicObjectEvent extends DynamicObjectEvent<
  BasePlayer,
  DynamicObject
> {
  protected onMoved(object: DynamicObject): TCommonCallback {
    const { north, east } = gateInfo;
    if (object === north.instance) {
      gateInfo.north.status =
        north.status === GateStatusEnum.CLOSING
          ? GateStatusEnum.CLOSED
          : GateStatusEnum.OPEN;
      return 1;
    }
    if (object === east.instance) {
      gateInfo.east.status =
        east.status === GateStatusEnum.CLOSING
          ? GateStatusEnum.CLOSED
          : GateStatusEnum.OPEN;
      return 1;
    }
    return 1;
  }
  //#region
  /* eslint-disable @typescript-eslint/no-unused-vars */
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
  /* eslint-enable @typescript-eslint/no-unused-vars */
  //#endregion
}

class Fs<P extends BasePlayer> {
  private labelGates: Array<Dynamic3DTextLabel> = [];
  private options: IA51Options<P>;
  private objectEvent: MyDynamicObjectEvent | null = null;
  constructor(options: IA51Options<P>) {
    this.options = options;
    this.load();
  }
  private load() {
    const { charset = "utf8", playerEvent } = this.options;

    this.registerEvent(playerEvent);
    this.loadStreamers(playerEvent, charset);
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
    // event should before create
    this.objectEvent = new MyDynamicObjectEvent(playerEvent.getPlayersMap());
    let nInstance, eInstance;
    ({
      A51LandObject,
      A51Fence,
      A51Buildings,
      A51NorthernGate: nInstance,
      A51EasternGate: eInstance,
    } = A51ObjectsFactory(charset));

    A51LandObject.create();
    this.log("  |--  Area 51 (69) Land object created");

    A51Fence.create();
    this.log("  |--  Area 51 (69) Fence object created");

    A51Buildings.forEach((o) => o.create());
    this.log("  |--  Area 51 (69) Building objects created");

    (gateInfo.north.instance = nInstance).create();
    (gateInfo.east.instance = eInstance).create();
    this.log("  |--  Area 51 (69) Gate objects created");

    this.labelGates = A51TextLabels(gateInfo, charset);
    this.labelGates.forEach((t) => t.create());
    this.log("  |--  Area 51 (69) Gates 3D Text Labels created");
    this.log("  |---------------------------------------------------");

    playerEvent.getPlayersArr().forEach((p) => {
      if (!p.isConnected() || p.isNpc()) return;
      this.removeBuilding(p);
    });
  }
  private unloadStreamers() {
    this.objectEvent = null;
    if (this.destroyValidObject(A51LandObject)) {
      this.log("  |---------------------------------------------------");
      this.log("  |--  Area 51 (69) Land object destroyed");
    }

    if (this.destroyValidObject(A51Fence)) {
      this.log("  |--  Area 51 (69) Fence object destroyed");
    }

    if (this.destroyValidObject(gateInfo.north.instance)) {
      this.log("  |--  Area 51 (69) Northern Gate object destroyed");
    }

    if (this.destroyValidObject(gateInfo.east.instance)) {
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
    const c_fn = (playerid: unknown) => {
      const p = playerEvent.findPlayerById(playerid as number);
      if (p) this.removeBuilding(p);
      return 1;
    };
    addCbListener("OnPlayerConnect", c_fn);

    const ksc_fn = (playerid: unknown, newkeys: unknown) => {
      const p = playerEvent.findPlayerById(playerid as number);
      if (p) this.moveGate(playerEvent, p, newkeys as KeysEnum);
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
      name,
      status,
      labelPos: position,
      openPos,
      closePos,
    } = gateInfo[direction];

    const doorLowName = name.toLowerCase();

    const { onGateMoving } = this.options;

    if (status === GateStatusEnum.OPENING) {
      if (onGateMoving) {
        onGateMoving(player, direction, status);
        return;
      }
      player.sendClientMessage(
        ColorEnum.MESSAGE_YELLOW,
        `* Sorry, you must wait for the ${doorLowName} to fully open first.`
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
        `* Sorry, you must wait for the ${doorLowName} to fully close first.`
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
        const gt = new BaseGameText(`~b~~h~${doorLowName} Opening!`, 3000, 3);
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
      const gt = new BaseGameText(`~b~~h~${doorLowName} Closing!`, 3000, 3);
      gt.forPlayer(player);
    }
    if (onGateClose && !closeRes) return;
    gateInfo[direction].instance?.move(cx, cy, cz, cspeed, crx, cry, crz);
    gateInfo[direction].status = GateStatusEnum.CLOSING;
    return;
  }
  private whichDoor(player: P): "east" | "north" | void {
    const { x: ex, y: ey, z: ez } = gateInfo.east.labelPos;
    const { x: nx, y: ny, z: nz } = gateInfo.north.labelPos;
    if (player.isInRangeOfPoint(10.0, ex, ey, ez)) return "east";
    if (player.isInRangeOfPoint(10.0, nx, ny, nz)) return "north";
    return;
  }
}

export const useA51BaseFS = <P extends BasePlayer>(options: IA51Options<P>) => {
  let $fs: Fs<P> | null = null;
  const use: A51FilterScript = {
    name: "a51_base",
    // load params : gm: BaseGameMode, args: ...
    load() {
      $fs = new Fs(options);
    },
    unload() {
      if ($fs) $fs.unload();
    },
  };
  return use;
};
