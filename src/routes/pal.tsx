import { useTranslation } from "react-i18next";

import { H1 } from "@/components/typography.tsx";

function PalApp() {
  const { t } = useTranslation("common");

  return (
    <>
      <H1>{t("title.pal")}</H1>
    </>
  );
}

export default PalApp;
