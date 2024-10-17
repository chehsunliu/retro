import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as fs from "node:fs";
import path from "path";
import { afterEach, describe, it, vi, expect } from "vitest";

import { PalApp } from "@/features/pal";
import { attrKeys, StatsProvider as PalStatsProvider } from "@/features/pal/stats-provider.tsx";
import { pause } from "@/lib/utils.ts";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("Before import", () => {
  afterEach(() => {
    cleanup();
  });

  it("blocks editing", async () => {
    render(
      <PalStatsProvider>
        <PalApp />
      </PalStatsProvider>,
    );

    expect(screen.getByLabelText("money").hasAttribute("disabled")).toBeTruthy();

    for (const attr of attrKeys) {
      const inputs = screen.getAllByLabelText(`attrs.${attr}`);
      expect(inputs.every((input) => input.hasAttribute("disabled"))).toBeTruthy();
    }
  });
});

describe("After import", () => {
  afterEach(() => {
    cleanup();
  });

  it("should show the game stats correctly", async () => {
    render(
      <PalStatsProvider>
        <PalApp />
      </PalStatsProvider>,
    );

    const importInput = screen.getByTestId("import-input");
    const buffer = fs.readFileSync(path.join(__dirname, "./data/dos/1.RPG"));
    await userEvent.upload(importInput, new File([buffer], "1.sav"));

    await pause(100);

    expect(screen.getByLabelText("money").getAttribute("value")).toBe("917153");
  });
});
