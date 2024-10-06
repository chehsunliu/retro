import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { attrKeys, useStats } from "@/features/swd-2e/stats-provider.tsx";

type Props = {
  id: string;
};

function CharacterCard({ id }: Props) {
  const { t } = useTranslation("swd-2e");
  const { stats, setAttr } = useStats();
  const char = stats.chars[id];

  const items = attrKeys.map((key) => (
    <div>
      <Label>{t(`attrs.${key}`)}</Label>
      <Input value={char.attrs[key]} onChange={(e) => setAttr(id, { key, value: parseInt(e.target.value, 10) })} />
    </div>
  ));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(`names.${id}`)}</CardTitle>
      </CardHeader>
      <CardContent>{items}</CardContent>
    </Card>
  );
}

export default CharacterCard;
