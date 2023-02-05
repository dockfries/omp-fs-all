import { GateStatusEnum } from "@/enums/gate";
import {
  BaseGameMode,
  BasePlayer,
  BasePlayerEvent,
  DynamicObject,
  IFilterScript,
  TLocales,
} from "omp-node-lib";

export interface IPosition {
  x: number;
  y: number;
  z: number;
}

export interface IMovePosition extends IPosition {
  speed: number;
  rx: number;
  ry: number;
  rz: number;
}

export interface A51FilterScript extends IFilterScript {
  load(gm: BaseGameMode, ...args: Array<unknown>): void;
}

export interface IA51Options<P extends BasePlayer> {
  locales?: TLocales;
  playerEvent: BasePlayerEvent<P>;
  command?: string | Array<string>;
  debug?: boolean;
  charset?: string;
  beforeMoveGate?: (player: P) => boolean;
  onGateMoving?: (
    player: P,
    direction: keyof IGateList,
    status: GateStatusEnum
  ) => boolean;
  onGateOpen?: (player: P, direction: keyof IGateList) => boolean;
  onGateClose?: (player: P, direction: keyof IGateList) => boolean;
  onTeleport?: (player: P) => unknown;
}

export interface IGateInfo {
  name: string;
  status: GateStatusEnum;
  labelPos: IPosition;
  openPos: IMovePosition;
  closePos: IMovePosition;
  instance: DynamicObject | null;
}

export interface IGateList {
  east: IGateInfo;
  north: IGateInfo;
}
