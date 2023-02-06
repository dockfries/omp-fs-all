import { ColorEnum } from "@/enums/color";
import { IA51Options, IGateList } from "@/interfaces";
import {
  BasePlayer,
  Dynamic3DTextLabel,
  Dynamic3dTextLabelEvent,
  I18n,
  TCommonCallback,
} from "omp-node-lib";

export const A51TextLabels = (
  gate: IGateList,
  charset: string,
  player: BasePlayer,
  i18n: I18n | null
) => {
  return [
    new Dynamic3DTextLabel({
      charset,
      text:
        i18n?.$t(
          "a51.labels.tips",
          [i18n.$t("a51.objects.gate.name.northern")],
          player.locale
        ) || "",
      colour: ColorEnum.GATES_LABEL,
      x: gate.north.labelPos.x,
      y: gate.north.labelPos.y,
      z: gate.north.labelPos.z,
      drawdistance: 10.5,
      worldid: 0,
      playerid: player.id,
    }),
    new Dynamic3DTextLabel({
      charset,
      text:
        i18n?.$t(
          "a51.labels.tips",
          [i18n.$t("a51.objects.gate.name.eastern")],
          player.locale
        ) || "",
      colour: ColorEnum.GATES_LABEL,
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
  private i18n: I18n | null = null;
  constructor(
    options: IA51Options<P>,
    destroyOnExit: boolean,
    i18n: I18n | null
  ) {
    super(options.playerEvent.getPlayersMap(), destroyOnExit);
    this.i18n = i18n;
  }
  protected onStreamIn(label: Dynamic3DTextLabel, player: P): TCommonCallback {
    label.updateText(
      label.getColour() || "#fff",
      this.i18n?.$t("a51.labels.tips", null, player.locale) || "",
      player.charset
    );
    return 1;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onStreamOut(label: Dynamic3DTextLabel, player: P): TCommonCallback {
    return 1;
  }
}
