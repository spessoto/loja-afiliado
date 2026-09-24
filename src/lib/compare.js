import { useEffect, useState } from "react";

const KEY = "compare_ids";
const MAX = 4;
const EVENT = "compare_changed";

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(EVENT));
}

export function useCompare() {
  const [ids, setIds] = useState(read);

  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isComparing = (id) => ids.includes(id);

  function toggle(id) {
    if (ids.includes(id)) {
      write(ids.filter(i => i !== id));
    } else if (ids.length < MAX) {
      write([...ids, id]);
    }
  }

  function clear() {
    write([]);
  }

  function retain(validIds) {
    const set = new Set(validIds);
    const atual = read();
    const kept = atual.filter(id => set.has(id));
    if (kept.length !== atual.length) write(kept);
  }

  return { ids, isComparing, toggle, clear, retain, max: MAX };
}
