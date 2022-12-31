import { GateStatusEnum } from "@/enums/gate";
import { IGateList } from "@/interfaces";
import {
  BasePlayer,
  DynamicObject,
  DynamicObjectEvent,
  EditResponseTypesEnum,
  TCommonCallback,
} from "omp-node-lib";

export const gateInfo: IGateList = {
  east: {
    name: "Eastern Gate",
    status: GateStatusEnum.CLOSED,
    labelPos: {
      x: 287.12,
      y: 1821.51,
      z: 18.14,
    },
    instance: null,
    openPos: {
      x: 286.008666,
      y: 1833.744628,
      z: 20.010623,
      speed: 1.1,
      rx: 0,
      ry: 0,
      rz: 90,
    },
    closePos: {
      x: 286.008666,
      y: 1822.744628,
      z: 20.010623,
      speed: 1.1,
      rx: 0,
      ry: 0,
      rz: 90,
    },
  },
  north: {
    name: "Northern Gate",
    status: GateStatusEnum.CLOSED,
    labelPos: {
      x: 135.09,
      y: 1942.37,
      z: 19.82,
    },
    instance: null,
    openPos: {
      x: 121.545074,
      y: 1941.527709,
      z: 21.691408,
      speed: 1.3,
      rx: 0,
      ry: 0,
      rz: 180,
    },
    closePos: {
      x: 134.545074,
      y: 1941.527709,
      z: 21.691408,
      speed: 1.3,
      rx: 0,
      ry: 0,
      rz: 180,
    },
  },
};

export class MyDynamicObjectEvent extends DynamicObjectEvent<
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
  protected onStreamIn(
    object: DynamicObject,
    player: BasePlayer
  ): TCommonCallback {
    return 1;
  }
  protected onStreamOut(
    object: DynamicObject,
    player: BasePlayer
  ): TCommonCallback {
    return 1;
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
  //#endregion
}

export const A51ObjectsFactory = (charset: string) => {
  const A51LandObject: DynamicObject = new DynamicObject({
    modelid: 11692,
    x: 199.344,
    y: 1943.79,
    z: 18.2031,
    rx: 0,
    ry: 0,
    rz: 0,
    charset,
  });
  const A51Buildings: Array<DynamicObject> = [
    new DynamicObject({
      modelid: 19905,
      x: 206.79895,
      y: 1931.643432,
      z: 16.450595,
      rx: 0,
      ry: 0,
      rz: 0,
      charset,
    }),
    new DynamicObject({
      modelid: 19905,
      x: 188.208908,
      y: 1835.033569,
      z: 16.450595,
      rx: 0,
      ry: 0,
      rz: 0,
      charset,
    }),
    new DynamicObject({
      modelid: 19905,
      x: 230.378875,
      y: 1835.033569,
      z: 16.450595,
      rx: 0,
      ry: 0,
      rz: 0,
      charset,
    }),
    new DynamicObject({
      modelid: 19907,
      x: 142.013977,
      y: 1902.538085,
      z: 17.633581,
      rx: 0,
      ry: 0,
      rz: 270.0,
      charset,
    }),
    new DynamicObject({
      modelid: 19907,
      x: 146.854003,
      y: 1846.008056,
      z: 16.53358,
      rx: 0,
      ry: 0,
      rz: 0,
      charset,
    }),
    new DynamicObject({
      modelid: 19909,
      x: 137.90039,
      y: 1875.024291,
      z: 16.836734,
      rx: 0,
      ry: 0,
      rz: 270.0,
      charset,
    }),
    new DynamicObject({
      modelid: 19909,
      x: 118.170387,
      y: 1875.184326,
      z: 16.846735,
      rx: 0,
      ry: 0,
      rz: 0,
      charset,
    }),
  ];
  const A51Fence: DynamicObject = new DynamicObject({
    modelid: 19312,
    x: 191.141,
    y: 1870.04,
    z: 21.4766,
    rx: 0,
    ry: 0,
    rz: 0,
    charset,
  });
  const { closePos: nClosePos } = gateInfo.north;
  const A51NorthernGate: DynamicObject = new DynamicObject({
    modelid: 19313,
    x: nClosePos.x,
    y: nClosePos.y,
    z: nClosePos.z,
    rx: nClosePos.rx,
    ry: nClosePos.ry,
    rz: nClosePos.rz,
    charset,
  });
  const { closePos: eClosePos } = gateInfo.east;
  const A51EasternGate: DynamicObject = new DynamicObject({
    modelid: 19313,
    x: eClosePos.x,
    y: eClosePos.y,
    z: eClosePos.z,
    rx: eClosePos.rx,
    ry: eClosePos.ry,
    rz: eClosePos.rz,
    charset,
  });
  return {
    A51LandObject,
    A51Buildings,
    A51Fence,
    A51NorthernGate,
    A51EasternGate,
  };
};
