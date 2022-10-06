import { COLOR } from "@/enums/color";
import { Dynamic3DTextLabel } from "omp-node-lib";

export const A51TextLabels = (gateNames: [string, string], charset: string) => {
  return [
    new Dynamic3DTextLabel({
      charset,
      text: `{CCCCCC}[${gateNames[0]}]\n{CCCCCC}Press '{FFFFFF}~k~~CONVERSATION_YES~{CCCCCC}' to open or close the gate`,
      color: COLOR.GATES_LABEL,
      x: 135.09,
      y: 1942.37,
      z: 19.82,
      drawdistance: 10.5,
      worldid: 0,
    }),
    new Dynamic3DTextLabel({
      charset,
      text: `{CCCCCC}[${gateNames[1]}]\n{CCCCCC}Press '{FFFFFF}~k~~CONVERSATION_YES~{CCCCCC}' to open or close the gate`,
      color: COLOR.GATES_LABEL,
      x: 287.12,
      y: 1821.51,
      z: 18.14,
      drawdistance: 10.5,
      worldid: 0,
    }),
  ];
};
