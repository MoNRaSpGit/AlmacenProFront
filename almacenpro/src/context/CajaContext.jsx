import { createContext, useState, useContext } from "react";

const CajaContext = createContext();

export function CajaProvider({ children }) {
  const [ultimoTotal, setUltimoTotal] = useState(0);

  return (
    <CajaContext.Provider value={{ ultimoTotal, setUltimoTotal }}>
      {children}
    </CajaContext.Provider>
  );
}

export function useCaja() {
  return useContext(CajaContext);
}
