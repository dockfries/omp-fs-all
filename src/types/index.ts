import { GATES } from "@/enums/gates";
import { DynamicObject } from "omp-node-lib";

export type TPosition = { x: number; y: number; z: number };
export type TMovePosition = {
  speed: number;
  rx: number;
  ry: number;
  rz: number;
} & TPosition;

export type TGateInfo = {
  name: string;
  status: GATES;
  labelPos: TPosition;
  openPos: TMovePosition;
  closePos: TMovePosition;
  instance: DynamicObject | null;
};

export type TGateList = {
  east: TGateInfo;
  north: TGateInfo;
};
