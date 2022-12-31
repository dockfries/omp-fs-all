import { ColorEnum } from "@/enums/color";
import { IA51Options, IGateList } from "@/interfaces";
import {
  BasePlayer,
  Dynamic3DTextLabel,
  Dynamic3dTextLabelEvent,
  TCommonCallback,
} from "omp-node-lib";

export const A51TextLabels = (
  gate: IGateList,
  charset: string,
  player: BasePlayer
) => {
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
      playerid: player.id,
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
      playerid: player.id,
    }),
  ];
};

export class My3dTextLabelEvent<
  P extends BasePlayer
> extends Dynamic3dTextLabelEvent<P, Dynamic3DTextLabel> {
  private options: IA51Options<P>;
  constructor(options: IA51Options<P>, destroyOnExit: boolean) {
    super(options.playerEvent.getPlayersMap(), destroyOnExit);
    this.options = options;
  }
  protected onStreamIn(label: Dynamic3DTextLabel, player: P): TCommonCallback {
    const { onLabelStreamIn } = this.options;
    if (onLabelStreamIn) {
      const { color, text } = onLabelStreamIn(label, player);
      label.updateText(
        color || label.getColor() || "#fff",
        text,
        player.charset
      );
    }
    return 1;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onStreamOut(label: Dynamic3DTextLabel, player: P): TCommonCallback {
    return 1;
  }
}
