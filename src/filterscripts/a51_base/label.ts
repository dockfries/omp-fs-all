import { ColorEnum } from "@/enums/color";
import { IGateList } from "@/interfaces";
import { Dynamic3DTextLabel } from "omp-node-lib";

export const A51TextLabels = (gate: IGateList, charset: string) => {
  return [
    new Dynamic3DTextLabel({
      charset,
      text: `{CCCCCC}[${gate.north.name}]\n{CCCCCC}Press '{FFFFFF}~k~~CONVERSATION_YES~{CCCCCC}' to open or close the gate`,
      color: ColorEnum.GATES_LABEL,
      x: gate.north.labelPos.x,
      y: gate.north.labelPos.y,
      z: gate.north.labelPos.z,
      drawdistance: 10.5,
      worldid: 0,
    }),
    new Dynamic3DTextLabel({
      charset,
      text: `{CCCCCC}[${gate.east.name}]\n{CCCCCC}Press '{FFFFFF}~k~~CONVERSATION_YES~{CCCCCC}' to open or close the gate`,
      color: ColorEnum.GATES_LABEL,
      x: gate.east.labelPos.x,
      y: gate.east.labelPos.y,
      z: gate.east.labelPos.z,
      drawdistance: 10.5,
      worldid: 0,
    }),
  ];
};
