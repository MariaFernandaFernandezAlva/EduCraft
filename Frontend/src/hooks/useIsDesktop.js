// src/hooks/useIsDesktop.js
// Devuelve true cuando la pantalla supera el breakpoint lg de Tailwind (1024px).

import { useState, useEffect } from "react";

const QUERY = "(min-width: 1024px)";

export default function useIsDesktop() {
  // Estado inicial calculado una sola vez, para que el primer render
  // ya sea correcto y no se vea un parpadeo de la vista equivocada.
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);

    // matchMedia avisa solo cuando se cruza el umbral,
    // a diferencia de un listener de resize que dispara sin parar.
    const onChange = (event) => setIsDesktop(event.matches);

    setIsDesktop(mql.matches);
    mql.addEventListener("change", onChange);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}