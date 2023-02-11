import { ColorEnum } from "@/filterscripts/a51_base/enums/color";
import { IA51Options, IGateList } from "@/interfaces";
import { log } from "@/utils/gl_common";
import {
  BasePlayer,
  Dynamic3DTextLabel,
  Dynamic3dTextLabelEvent,
  I18n,
} from "omp-node-lib";
import { gateInfo } from "./object";
import { A51Player, playerEvent } from "./player";

const labelGates: Map<A51Player, Array<Dynamic3DTextLabel>> = new Map();

const A51TextLabels = (
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

export const loadLabels = (p: A51Player, options: IA51Options, i18n: I18n) => {
  labelGates.set(p, A51TextLabels(gateInfo, p, i18n));
  labelGates.get(p)?.forEach((t) => t.create()?.toggleCallbacks());
  log(options, `  |--  ${i18n?.$t("a51.labels.created")}`);
};

export const unloadLabels = (
  options: IA51Options,
  i18n: I18n,
  p?: A51Player
) => {
  if (p) {
    labelGates.get(p)?.forEach((t) => t.isValid() && t.destroy());
    labelGates.delete(p);
  } else {
    labelGates.forEach((v) => v.forEach((t) => t.isValid() && t.destroy()));
  }
  log(options, `  |--  ${i18n?.$t("a51.labels.destroyed")}`);
};

export const registerLabelEvent = (options: IA51Options, i18n: I18n) => {
  new My3dTextLabelEvent(false, i18n);
  log(options, "  |---------------------------------------------------");
};
