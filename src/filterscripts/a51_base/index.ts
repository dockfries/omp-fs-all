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
import { PlaySoundForPlayersInRange } from "@/utils/gl_common";
import {
  BaseGameText,
  BasePlayer,
  BasePlayerEvent,
  BodyPartsEnum,
  Dynamic3DTextLabel,
  DynamicObject,
  ICmdErr,
  InvalidEnum,
  IPlayerSettings,
  KeysEnum,
  PlayerStateEnum,
  TCommonCallback,
  WeaponEnum,
  TFilterScript,
  DynamicObjectEvent,
  EditResponseTypesEnum,
} from "omp-node-lib";
import {
  A51Buildings,
  A51EasternGate,
  A51Fence,
  A51LandObject,
  A51NorthernGate,
} from "./objects";

export interface IA51Options {
  debug?: boolean;
  charset?: string;
}

export type A51FilterScript = TFilterScript & {
  options: IA51Options | null;
  load(options: IA51Options): void;
  removeBuilding(p: MyPlayer): void;
  destroyValidObject(o: DynamicObject | Array<DynamicObject>): boolean;
  log(msg: string): void;
};

const GateNames = ["Northern Gate", "Eastern Gate"];

let NorthernGateStatus = GATES.CLOSED;
let EasternGateStatus = GATES.CLOSED;

class MyPlayer extends BasePlayer {
  settings: IPlayerSettings = {
    charset: useA51BaseFS.options?.charset || "utf8",
  };
}

class MyCallbacks extends BasePlayerEvent<MyPlayer> {
  protected newPlayer(playerid: number): MyPlayer {
    return new MyPlayer(playerid);
  }
  protected onConnect(player: MyPlayer): TCommonCallback {
    useA51BaseFS.removeBuilding(player);
    return 1;
  }
  protected onKeyStateChange(
    player: MyPlayer,
    newkeys: KeysEnum
  ): TCommonCallback {
    if (!(newkeys & KeysEnum.YES)) return 1;
    if (player.isInRangeOfPoint(10.0, 287.12, 1821.51, 18.14)) {
      if (EasternGateStatus === GATES.OPENING) {
        player.sendClientMessage(
          COLOR.MESSAGE_YELLOW,
          "* Sorry, you must wait for the eastern gate to fully open first."
        );
        return 1;
      }
      if (EasternGateStatus === GATES.CLOSING) {
        player.sendClientMessage(
          COLOR.MESSAGE_YELLOW,
          "* Sorry, you must wait for the eastern gate to fully close first."
        );
        return 1;
      }
      PlaySoundForPlayersInRange(
        this.getPlayersArr(),
        1035,
        50.0,
        287.12,
        1821.51,
        18.14
      );
      if (EasternGateStatus == GATES.CLOSED) {
        const gt = new BaseGameText("~b~~h~Eastern Gate Opening!", 3000, 3);
        gt.forPlayer(player);
        A51EasternGate.move(286.008666, 1833.744628, 20.010623, 1.1, 0, 0, 90);
        EasternGateStatus = GATES.OPENING;
        return 1;
      }
      const gt = new BaseGameText("~b~~h~Eastern Gate Closing!", 3000, 3);
      gt.forPlayer(player);
      A51EasternGate.move(286.008666, 1822.744628, 20.010623, 1.1, 0, 0, 90);
      EasternGateStatus = GATES.CLOSING;
      return 1;
    }

    if (player.isInRangeOfPoint(10.0, 135.09, 1942.37, 19.82)) {
      if (NorthernGateStatus == GATES.OPENING) {
        const msg =
          "* Sorry, you must wait for the northern gate to fully open first.";
        player.sendClientMessage(COLOR.MESSAGE_YELLOW, msg);
        return 1;
      } else if (NorthernGateStatus == GATES.CLOSING) {
        const msg =
          "* Sorry, you must wait for the northern gate to fully close first.";
        player.sendClientMessage(COLOR.MESSAGE_YELLOW, msg);
        return 1;
      }

      // Play gate opening sound
      PlaySoundForPlayersInRange(
        this.getPlayersArr(),
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
        A51NorthernGate.move(
          121.545074,
          1941.527709,
          21.691408,
          1.3,
          0,
          0,
          180
        );
        NorthernGateStatus = GATES.OPENING;
      } else {
        const gt = new BaseGameText("~b~~h~Northern Gate Closing!", 3000, 3);
        gt.forPlayer(player);
        A51NorthernGate.move(
          134.545074,
          1941.527709,
          21.691408,
          1.3,
          0,
          0,
          180
        );
        NorthernGateStatus = GATES.CLOSING;
      }
    }
    return 1;
  }
  //#region
  protected onDisconnect(player: MyPlayer, reason: number): TCommonCallback {
    return 1;
  }
  protected onText(player: MyPlayer, text: string): TCommonCallback {
    return 1;
  }
  protected onCommandReceived(
    player: MyPlayer,
    command: string
  ): TCommonCallback {
    return 1;
  }
  protected onCommandPerformed(
    player: MyPlayer,
    command: string
  ): TCommonCallback {
    return 1;
  }
  protected onCommandError(
    player: MyPlayer,
    command: string,
    err: ICmdErr
  ): TCommonCallback {
    return 1;
  }
  protected onEnterExitModShop(
    player: MyPlayer,
    enterexit: number,
    interiorid: number
  ): TCommonCallback {
    return 1;
  }
  protected onClickMap(
    player: MyPlayer,
    fX: number,
    fY: number,
    fZ: number
  ): TCommonCallback {
    return 1;
  }
  protected onClickPlayer(
    player: MyPlayer,
    clickedPlayer: MyPlayer,
    source: number
  ): TCommonCallback {
    return 1;
  }
  protected onDeath(
    player: MyPlayer,
    killer: MyPlayer | InvalidEnum.PLAYER_ID,
    reason: number
  ): TCommonCallback {
    return 1;
  }
  protected onGiveDamage(
    player: MyPlayer,
    damage: MyPlayer,
    amount: number,
    weaponid: WeaponEnum,
    bodypart: BodyPartsEnum
  ): TCommonCallback {
    return 1;
  }
  protected onRequestClass(player: MyPlayer, classid: number): TCommonCallback {
    return 1;
  }
  protected onRequestSpawn(player: MyPlayer): TCommonCallback {
    return 1;
  }
  protected onSpawn(player: MyPlayer): TCommonCallback {
    return 1;
  }
  protected onStateChange(
    player: MyPlayer,
    newstate: PlayerStateEnum,
    oldstate: PlayerStateEnum
  ): TCommonCallback {
    return 1;
  }
  protected onStreamIn(player: MyPlayer, forPlayer: MyPlayer): TCommonCallback {
    return 1;
  }
  protected onStreamOut(
    player: MyPlayer,
    forPlayer: MyPlayer
  ): TCommonCallback {
    return 1;
  }
  protected onTakeDamage(
    player: MyPlayer,
    damage: MyPlayer | InvalidEnum.PLAYER_ID,
    amount: number,
    weaponid: WeaponEnum,
    bodypart: BodyPartsEnum
  ): TCommonCallback {
    return 1;
  }
  protected onUpdate(player: MyPlayer): TCommonCallback {
    return 1;
  }
  protected onInteriorChange(
    player: MyPlayer,
    newinteriorid: number,
    oldinteriorid: number
  ): TCommonCallback {
    return 1;
  }
  protected onPause(player: MyPlayer, timestamp: number): TCommonCallback {
    return 1;
  }
  protected onResume(player: MyPlayer, pauseMs: number): TCommonCallback {
    return 1;
  }
  protected onRequestDownload(
    player: MyPlayer,
    type: number,
    crc: number
  ): TCommonCallback {
    return 1;
  }
  protected onFinishedDownloading(
    player: MyPlayer,
    virtualworld: number
  ): TCommonCallback {
    return 1;
  }
  //#endregion
}

class MyDynamicObjectEvent extends DynamicObjectEvent<MyPlayer, DynamicObject> {
  protected onMoved(object: DynamicObject): TCommonCallback {
    if (object === A51NorthernGate) {
      NorthernGateStatus =
        NorthernGateStatus === GATES.CLOSING ? GATES.CLOSED : GATES.OPEN;
      return 1;
    }
    if (object == A51EasternGate) {
      EasternGateStatus =
        EasternGateStatus === GATES.CLOSING ? GATES.CLOSED : GATES.OPEN;
      return 1;
    }
    return 1;
  }
  //#region
  protected onPlayerEdit(
    player: MyPlayer,
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
    player: MyPlayer,
    object: DynamicObject,
    modelid: number,
    x: number,
    y: number,
    z: number
  ): TCommonCallback {
    return 1;
  }
  protected onPlayerShoot(
    player: MyPlayer,
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

const cbs = new MyCallbacks();
cbs.onCommandText("a51", (p) => {
  p.setInterior(0);
  p.setPos(135.2, 1948.51, 19.74);
  p.setFacingAngle(180);
  p.setCameraBehind();
  new BaseGameText("~b~~h~Area 51 (69) Base!", 3000, 3).forPlayer(p);
});

new MyDynamicObjectEvent(cbs.getPlayersMap());

export const useA51BaseFS: TFilterScript = {
  name: "a51_base",
  load(options: IA51Options) {
    const LabelGates: Array<Dynamic3DTextLabel> = [
      new Dynamic3DTextLabel({
        charset: options?.charset || "utf8",
        text: `{CCCCCC}[${GateNames[0]}]\n{CCCCCC}Press '{FFFFFF}~k~~CONVERSATION_YES~{CCCCCC}' to open or close the gate`,
        color: COLOR.GATES_LABEL,
        x: 135.09,
        y: 1942.37,
        z: 19.82,
        drawdistance: 10.5,
        worldid: 0,
        testlos: false,
      }),
      new Dynamic3DTextLabel({
        charset: options?.charset || "utf8",
        text: `{CCCCCC}[${GateNames[1]}]\n{CCCCCC}Press '{FFFFFF}~k~~CONVERSATION_YES~{CCCCCC}' to open or close the gate`,
        color: COLOR.GATES_LABEL,
        x: 287.12,
        y: 1821.51,
        z: 18.14,
        drawdistance: 10.5,
        worldid: 0,
        testlos: false,
      }),
    ];

    this.log("\n");
    this.log("  |---------------------------------------------------");
    this.log("  |--- Area 51 (69) Building Objects Filterscript");
    this.log("  |--  Script v1.01");
    this.log("  |--  28th March 2015");
    this.log("  |---------------------------------------------------");

    A51LandObject.create();
    this.log("  |--  Area 51 (69) Land object created");

    A51Fence.create();
    this.log("  |--  Area 51 (69) Fence object created");

    A51Buildings.forEach((o) => o.create());
    this.log("  |--  Area 51 (69) Building objects created");

    A51NorthernGate.create();
    A51EasternGate.create();
    this.log("  |--  Area 51 (69) Gate objects created");

    LabelGates.forEach((t) => t.create());
    this.log("  |--  Area 51 (69) Gates 3D Text Labels created");
    this.log("  |---------------------------------------------------");

    cbs.getPlayersArr().forEach((p) => {
      if (!p.isConnected() || p.isNpc()) return;
      this.removeBuilding(p);
    });
  },
  unload() {
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

    A51Buildings.forEach((o, i) => {
      if (this.destroyValidObject(o)) {
        this.log(`  |--  Area 51 (69) Building object ${i + 1} destroyed`);
      }
    });

    LabelGates.forEach((t) => t.destroy());
    this.log("  |--  Deleted the 3D Text Labels on the Area 51 (69) Gates");
    this.log("  |---------------------------------------------------");
    this.log("  |--  Area 51 (69) Base Objects Filterscript Unloaded");
    this.log("  |---------------------------------------------------");
  },
  log(msg: string) {
    if (this.options?.debug === false) return;
    console.log(msg);
  },
  removeBuilding(p: MyPlayer) {
    p.removeBuilding(16203, 199.344, 1943.79, 18.2031, 250.0);
    p.removeBuilding(16590, 199.344, 1943.79, 18.2031, 250.0);
    p.removeBuilding(16323, 199.336, 1943.88, 18.2031, 250.0);
    p.removeBuilding(16619, 199.336, 1943.88, 18.2031, 250.0);
    p.removeBuilding(1697, 228.797, 1835.34, 23.2344, 250.0);
    p.removeBuilding(16094, 191.141, 1870.04, 21.4766, 250.0);
  },
  destroyValidObject(o: DynamicObject | Array<DynamicObject>) {
    if (Array.isArray(o)) {
      o.forEach((v) => this.destroyValidObject(v));
      return true;
    }
    if (o.isValid()) {
      o.destroy();
      return true;
    }
    return false;
  },
};
