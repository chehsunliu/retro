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

const addresses = {
  money: 0x0004,
};

type StatsContextType = {
  stats: {
    bufIn: ArrayBuffer;
    money: number;
  };
  setBufIn(buf: ArrayBuffer): void;
  getModifiedBuffer(): ArrayBuffer;
  setMoney(money: number): void;
};

const initialStats: StatsContextType["stats"] = {
  bufIn: new ArrayBuffer(0),
  money: 0,
};

const StatsContext = createContext<StatsContextType>({
  stats: initialStats,
  setBufIn: () => {},
  getModifiedBuffer: () => new ArrayBuffer(0),
  setMoney: () => {},
});

type StatsProviderProps = {
  children: React.ReactNode;
};

export function StatsProvider({ children, ...props }: StatsProviderProps) {
  const [stats, setStats] = useState<StatsContextType["stats"]>(initialStats);

  const setBufIn = (buf: ArrayBuffer) => {
    const bufViewer = new DataView(buf.slice(0));
    setStats({
      bufIn: bufViewer.buffer,
      money: bufViewer.getUint32(addresses.money, true),
    });
  };

  const getModifiedBuffer = () => {
    const bufOut = new DataView(stats.bufIn.slice(0));
    // Money
    bufOut.setUint32(addresses.money, stats.money, true);

    return bufOut.buffer;
  };

  const setMoney = (money: number) => {
    setStats({ ...stats, money });
  };

  const value: StatsContextType = {
    stats,
    setBufIn,
    getModifiedBuffer,
    setMoney,
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
