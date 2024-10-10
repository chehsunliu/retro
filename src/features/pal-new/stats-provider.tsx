import React, { createContext, useContext, useState } from "react";

const characterAddresses: Record<string, number> = {
  li: 0x0018,
  chao: 0x0240,
  lin: 0x0468,
  anu: 0x0690,
  queen: 0x8b8,
  li2: 0x1380,
};

export const characterIds: string[] = Object.keys(characterAddresses);

export const attrKeys = [
  "level",
  "xpMax",
  "xp",
  "hpMax",
  "hp",
  "mpMax",
  "mp",
  "physicalDamage",
  "magicalDamage",
  "defense",
  "speed",
  "luck",
] as const;

type AttrKey = (typeof attrKeys)[number];

const addresses = {
  money: 0x0004,
  inventorySize: 0x2b38,
  inventory: 0x2b3c,
};

const attrAddressOffsets: { [k in AttrKey]: number } = {
  level: 0x04,
  xpMax: 0x08,
  xp: 0x0c,
  hpMax: 0x14,
  hp: 0x18,
  mpMax: 0x1c,
  mp: 0x20,
  physicalDamage: 0x24,
  magicalDamage: 0x28,
  defense: 0x2c,
  speed: 0x30,
  luck: 0x34,
};

type Character = {
  attrs: {
    level: number;
    xpMax: number;
    xp: number;
    hpMax: number;
    hp: number;
    mpMax: number;
    mp: number;
    physicalDamage: number;
    magicalDamage: number;
    defense: number;
    speed: number;
    luck: number;
  };
};

type StatsContextType = {
  stats: {
    bufIn: ArrayBuffer;
    money: number;
    chars: Record<string, Character>;
    inventory: Record<number, number>;
  };
  setBufIn(buf: ArrayBuffer): void;
  getModifiedBuffer(): ArrayBuffer;
  setMoney(money: number): void;
  setAttr(id: string, attr: { key: AttrKey; value: number }): void;
  setInventoryItem(value: number, count: number): void;
};

const initialCharacter: Character = {
  attrs: {
    level: 0,
    xpMax: 0,
    xp: 0,
    hpMax: 0,
    hp: 0,
    mpMax: 0,
    mp: 0,
    physicalDamage: 0,
    magicalDamage: 0,
    defense: 0,
    speed: 0,
    luck: 0,
  },
};

const initialStats: StatsContextType["stats"] = {
  bufIn: new ArrayBuffer(0),
  money: 0,
  chars: {
    li: initialCharacter,
    chao: initialCharacter,
    lin: initialCharacter,
    anu: initialCharacter,
    queen: initialCharacter,
    li2: initialCharacter,
  },
  inventory: {},
};

const StatsContext = createContext<StatsContextType>({
  stats: initialStats,
  setBufIn: () => {},
  getModifiedBuffer: () => new ArrayBuffer(0),
  setMoney: () => {},
  setAttr: () => {},
  setInventoryItem: () => {},
});

type StatsProviderProps = {
  children: React.ReactNode;
};

export function StatsProvider({ children, ...props }: StatsProviderProps) {
  const [stats, setStats] = useState<StatsContextType["stats"]>(initialStats);

  const setBufIn = (buf: ArrayBuffer) => {
    const bufViewer = new DataView(buf.slice(0));

    const inventorySize = bufViewer.getUint32(addresses.inventorySize, true);
    const inventory: StatsContextType["stats"]["inventory"] = {};
    for (let i = 0; i < inventorySize; i++) {
      const valueAddr = addresses.inventory + 20 * i;
      const countAddr = valueAddr + 4;

      const value = bufViewer.getUint32(valueAddr, true);
      if (value === 0) {
        // It's possible the whole 20 bytes are all zeros.
        continue;
      }

      inventory[value] = bufViewer.getUint32(countAddr, true);
    }

    setStats({
      bufIn: bufViewer.buffer,
      money: bufViewer.getUint32(addresses.money, true),
      chars: Object.fromEntries(
        characterIds.map((id) => {
          const addr = characterAddresses[id];
          const attrs = Object.fromEntries(
            attrKeys.map((key) => [key, bufViewer.getUint32(addr + attrAddressOffsets[key], true)]),
          ) as { [k in AttrKey]: number };

          return [id, { attrs }];
        }),
      ),
      inventory,
    });
  };

  const getModifiedBuffer = () => {
    const bufOut = new DataView(stats.bufIn.slice(0));

    // Money
    bufOut.setUint32(addresses.money, stats.money, true);

    // Character
    Object.entries(stats.chars).forEach(([id, char]) => {
      const addr = characterAddresses[id];

      // Stats
      Object.entries(char.attrs).forEach(([attrKey, attrValue]) => {
        bufOut.setUint16(addr + attrAddressOffsets[attrKey as AttrKey], attrValue, true);
      });
    });

    // Inventory
    bufOut.setUint32(addresses.inventorySize, Object.keys(stats.inventory).length, true);
    Object.entries(stats.inventory).forEach(([id, count], i) => {
      const valueAddr = addresses.inventory + i * 20;
      const countAddr = valueAddr + 4;
      bufOut.setUint32(valueAddr, parseInt(id, 10), true);
      bufOut.setUint32(countAddr, count, true);
    });

    return bufOut.buffer;
  };

  const setMoney = (money: number) => {
    setStats({ ...stats, money });
  };

  const setAttr = (id: string, attr: { key: AttrKey; value: number }) => {
    setStats({
      ...stats,
      chars: {
        ...stats.chars,
        [id]: {
          ...stats.chars[id],
          attrs: { ...stats.chars[id].attrs, [attr.key]: attr.value },
        },
      },
    });
  };

  const setInventoryItem = (value: number, count: number) => {
    if (count > 99 || count < 0) {
      return;
    }

    const inventory = { ...stats.inventory };
    if (count > 0) {
      inventory[value] = count;
    } else {
      delete inventory[value];
    }
    setStats({ ...stats, inventory });
  };

  const value: StatsContextType = {
    stats,
    setBufIn,
    getModifiedBuffer,
    setMoney,
    setAttr,
    setInventoryItem,
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
