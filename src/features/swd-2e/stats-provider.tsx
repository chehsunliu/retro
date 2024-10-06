import React, { createContext, useContext, useState } from "react";

const characterAddresses: Record<string, number> = {
  fu: 0x014a,
  wood: 0x01e9,
  stone: 0x0288,
  sang: 0x0327,
};

export const characterIds: string[] = Object.keys(characterAddresses);

export const attrKeys = [
  "level",
  "xp",
  "xpMax",
  "hp",
  "hpMax",
  "pp",
  "ppMax",
  "mp",
  "mpMax",
  //
  "power",
  "wisdom",
  "speed",
  "luck",
  //
  "response",
  "offense",
  "defense",
  "dodge",
] as const;

type AttrKey = (typeof attrKeys)[number];

const addresses = {
  money: 0x011b,
};

const attrAddresses: { [k in AttrKey]: number } = {
  offense: -0x21,
  defense: -0x1f,
  hp: 0x00,
  hpMax: 0x02,
  level: 0x04,
  luck: 0x06,
  pp: 0x08,
  ppMax: 0x0a,
  xp: 0x0c,
  xpMax: 0x0e,
  power: 0x10,
  wisdom: 0x18,
  speed: 0x20,
  mp: 0x28,
  mpMax: 0x2a,
  response: 0x30,
  dodge: 0x38,
};

type Character = {
  attrs: {
    level: number;
    xp: number;
    xpMax: number;
    hp: number;
    hpMax: number;
    pp: number;
    ppMax: number;
    mp: number;
    mpMax: number;
    //
    power: number;
    wisdom: number;
    speed: number;
    luck: number;
    //
    response: number;
    offense: number;
    defense: number;
    dodge: number;
  };
};

type StatsContextType = {
  stats: {
    bufIn: ArrayBuffer;
    bufOut: DataView;
    money: number;
    chars: Record<string, Character>;
  };
  setBufIn: (buf: ArrayBuffer) => void;
  setMoney: (money: number) => void;
  setAttr: (id: string, attr: { key: AttrKey; value: number }) => void;
};

const initialCharacter: Character = {
  attrs: {
    level: 0,
    xp: 0,
    xpMax: 0,
    hp: 0,
    hpMax: 0,
    pp: 0,
    ppMax: 0,
    mp: 0,
    mpMax: 0,
    //
    power: 0,
    wisdom: 0,
    speed: 0,
    luck: 0,
    //
    response: 0,
    offense: 0,
    defense: 0,
    dodge: 0,
  },
};

const initialStats: StatsContextType["stats"] = {
  bufIn: new ArrayBuffer(0),
  bufOut: new DataView(new ArrayBuffer(0)),
  money: 0,
  chars: {
    fu: initialCharacter,
    sang: initialCharacter,
    wood: initialCharacter,
    stone: initialCharacter,
  },
};

const StatsContext = createContext<StatsContextType>({
  stats: initialStats,
  setBufIn: () => {},
  setMoney: () => {},
  setAttr: () => {},
});

type StatsProviderProps = {
  children: React.ReactNode;
};

export function StatsProvider({ children, ...props }: StatsProviderProps) {
  const [stats, setStats] = useState<StatsContextType["stats"]>(initialStats);

  const setBufIn = (buf: ArrayBuffer) => {
    const bufOut = new DataView(buf.slice(0));
    setStats({
      bufIn: buf,
      bufOut,
      money: bufOut.getUint16(addresses.money, true),
      chars: Object.fromEntries(
        characterIds.map((id) => {
          const addr = characterAddresses[id];
          const attrs = Object.fromEntries(
            attrKeys.map((key) => [key, bufOut.getUint16(addr + attrAddresses[key], true)]),
          ) as { [k in AttrKey]: number };
          return [id, { attrs }];
        }),
      ),
    });
  };

  const bufOut = new DataView(stats.bufOut.buffer.slice(0));

  const setMoney = (money: number) => {
    bufOut.setUint16(addresses.money, money, true);
    setStats({ ...stats, bufOut, money });
  };

  const setAttr = (id: string, attr: { key: AttrKey; value: number }) => {
    const addr = characterAddresses[id];
    bufOut.setUint16(addr + attrAddresses[attr.key], attr.value, true);
    setStats({
      ...stats,
      bufOut,
      chars: {
        ...stats.chars,
        [id]: {
          ...stats.chars[id],
          attrs: { ...stats.chars[id].attrs, [attr.key]: attr.value },
        },
      },
    });
  };

  const value: StatsContextType = {
    stats,
    setBufIn,
    setMoney,
    setAttr,
  };

  return (
    <StatsContext.Provider {...props} value={value}>
      {children}
    </StatsContext.Provider>
  );
}

export const useStats = () => {
  const context = useContext(StatsContext);

  if (context === undefined) {
    throw new Error("useStats must be used within a StatsProvider");
  }

  return context;
};
