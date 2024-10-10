import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { attrKeys, useStats } from "@/features/pal-new/stats-provider.tsx";

type Props = {
  id: string;
};

function CharacterCard({ id }: Props) {
  const { t } = useTranslation("pal-new");
  const { stats, setAttr } = useStats();
  const char = stats.chars[id];

  const items = attrKeys.map((key) => (
    <div key={key}>
      <Label>{t(`attrs.${key}`)}</Label>
      <Input value={char.attrs[key]} onChange={(e) => setAttr(id, { key, value: parseInt(e.target.value, 10) })} />
    </div>
  ));

  return (
    <Card className={"w-full"}>
      <CardHeader>
        <CardTitle className={"text-xl"}>{t(`names.${id}`)}</CardTitle>
      </CardHeader>
      <CardContent className={"space-y-5"}>
        <div>
          <CardTitle className={"text-lg"}>{t("subtitle.stats")}</CardTitle>
          <div className={"grid grid-flow-row-dense grid-cols-4 gap-3"}>{items}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CharacterCard;
