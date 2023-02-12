import { ICommonOptions } from "@/interfaces";
import { BasePlayer, KeysEnum } from "omp-node-lib";

export const IsKeyJustDown = (
  key: KeysEnum,
  newkeys: KeysEnum,
  oldkeys: KeysEnum
) => {
  if (newkeys & key && !(oldkeys & key)) return true;
  return false;
};

export const PlaySoundForAll = (
  players: Array<BasePlayer>,
  soundid: number,
  x: number,
  y: number,
  z: number
) => {
  players.forEach((p) => {
    if (p.isConnected()) p.playSound(soundid, x, y, z);
  });
};

export const PlaySoundForPlayersInRange = (
  players: Array<BasePlayer>,
  soundid: number,
  range: number,
  x: number,
  y: number,
  z: number
) => {
  players.forEach((p) => {
    if (p.isConnected() && p.isInRangeOfPoint(range, x, y, z))
      p.playSound(soundid, x, y, z);
  });
};

export const log = (options: ICommonOptions, msg: string) => {
  if (options.debug) console.log(msg);
};

export const recursePlayerEvent = (
  curr: object | null,
  prev: object | null = curr
): object | null => {
  if (curr === null) return prev;
  return recursePlayerEvent(Reflect.getPrototypeOf(curr), curr);
};

/**
 * If a player event class is passed in from the outside,
 * the event class inside fs will act as its parent to resolve the command nonexistence problem
 */
export const setPlayerEventParent = (
  childPlayerEvent: object | undefined,
  parentPlayerEvent: object
) => {
  if (!childPlayerEvent) return;
  Reflect.setPrototypeOf(
    recursePlayerEvent(childPlayerEvent) || childPlayerEvent,
    parentPlayerEvent
  );
};
