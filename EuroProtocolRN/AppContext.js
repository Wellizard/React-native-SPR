import React, { createContext, useContext, useState } from 'react';

const empty = { name: '', birth: '', plate: '', phone: '' };
const Ctx = createContext(null);

export function ReportProvider({ children }) {
    const [report, setReport] = useState({
        conditions: [false, false, false, false],
        dateTime: new Date(),
        participants: { A: { ...empty }, B: { ...empty } },
        place: { text: '', coord: null },
        sketch: { paths: [], file: null },
    });
    const update = (key, value) => setReport((r) => ({ ...r, [key]: value }));
    return <Ctx.Provider value={{ report, update }}>{children}</Ctx.Provider>;
}

export const useReport = () => useContext(Ctx);