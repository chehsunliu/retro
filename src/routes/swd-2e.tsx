import { useTranslation } from "react-i18next";

import ActionButtons from "@/components/action-buttons.tsx";
import { H1, H2 } from "@/components/typography.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import CharacterCard from "@/features/swd-2e/character-card.tsx";
import InventorySection from "@/features/swd-2e/inventory.tsx";
import { characterIds, useStats } from "@/features/swd-2e/stats-provider.tsx";

function GeneralSection() {
  const { t } = useTranslation("common");
  const { t: t2 } = useTranslation("swd-2e");
  const { stats, setMoney } = useStats();

  return (
    <>
      <H2>{t("subtitle.general")}</H2>
      <div className={"w-20"}>
        <Label htmlFor={"money"}>{t2("money")}</Label>
        <Input id={"money"} value={stats.money} onChange={(e) => setMoney(parseInt(e.target.value, 10))} />
      </div>
    </>
  );
}

function CharacterSection() {
  const { t } = useTranslation("common");
  const characterBlocks = characterIds.map((id) => <CharacterCard id={id} key={id} />);

  return (
    <>
      <H2>{t("subtitle.character")}</H2>
      <div className={"grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4"}>{characterBlocks}</div>
    </>
  );
}

function Swd2eApp() {
  const { t } = useTranslation("common");
  const { setBufIn, getModifiedBuffer } = useStats();

  const handleImport = (buffer: ArrayBuffer) => {
    setBufIn(buffer);
  };

  const handleExport = () => {
    return getModifiedBuffer();
  };

  return (
    <div className={"space-y-8"}>
      <div className={"flex flex-row justify-between items-end"}>
        <H1>{t("title.swd-2e")}</H1>
        <ActionButtons onImport={handleImport} onExport={handleExport} />
      </div>
      <GeneralSection />
      <CharacterSection />
      <InventorySection />
    </div>
  );
}

export default Swd2eApp;
