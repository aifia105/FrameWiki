import { useEffect, useState } from "react";

const BASE = "https://api.warframestat.us";

export type Warframe = {
  name: string;
  uniqueName: string;
  description: string;
  thumbnail: string;
  health: number;
  shield: number;
  armor: number;
  power: number;
  speed: string;
  mr: string;
  aura: string;
  polarities: string[];
  type: string;
  introduced?: { name: string; date: string };
  location?: string;
  tradable: boolean;
  url: string;
  // Prime variants
  prime_health?: number;
  prime_shield?: number;
  prime_armor?: number;
  prime_power?: string;
  prime_speed?: string;
  prime_mr?: string;
  prime_aura?: string;
  prime_url?: string;
};

export function useWarframes() {
  const [data, setData] = useState<Warframe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE}/warframes?language=en`)
      .then((r) => r.json())
      .then((json: Warframe[]) => {
        // Filter out non-playable entries, keep only frames with thumbnails
        const playable = json.filter(
          (w) =>
            w.thumbnail && w.health > 0 && !w.uniqueName.includes("Specter"),
        );
        setData(playable);
      })
      .catch(() => setError("Failed to load Warframes."))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useWarframe(query: string) {
  const [data, setData] = useState<Warframe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;
    fetch(`${BASE}/warframes/${encodeURIComponent(query)}?language=en`)
      .then((r) => r.json())
      .then((json: Warframe) => setData(json))
      .catch(() => setError("Failed to load Warframe."))
      .finally(() => setLoading(false));
  }, [query]);

  return { data, loading, error };
}
