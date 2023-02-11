import { ColorEnum } from "@/filterscripts/a51_base/enums/color";
import { IGateList } from "@/interfaces";
import {
  BasePlayer,
  Dynamic3DTextLabel,
  Dynamic3dTextLabelEvent,
  I18n,
} from "omp-node-lib";
import { A51Player, playerEvent } from "./player";

export const A51TextLabels = (
  gate: IGateList,
  player: BasePlayer,
  i18n: I18n | null
) => {
  return [
    new Dynamic3DTextLabel({
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

export class My3dTextLabelEvent extends Dynamic3dTextLabelEvent<
  A51Player,
  Dynamic3DTextLabel
> {
  constructor(destroyOnExit: boolean, private i18n: I18n | null) {
    super(playerEvent.getPlayersMap(), destroyOnExit);
  }
  onStreamIn(label: Dynamic3DTextLabel, player: A51Player) {
    label.updateText(
      label.getColour() || "#fff",
      this.i18n?.$t("a51.labels.tips", null, player.locale) || "",
      player.charset
    );
    return 1;
  }
}
