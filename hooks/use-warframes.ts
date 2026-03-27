import { useEffect, useState } from "react";

const BASE = "https://api.warframestat.us";

type ApiWarframe = {
  name?: string;
  uniqueName?: string;
  description?: string;
  thumbnail?: string;
  wikiaThumbnail?: string;
  imageName?: string;
  health?: number;
  shield?: number;
  armor?: number;
  power?: number;
  speed?: string | number;
  sprint?: string | number;
  sprintSpeed?: string | number;
  mr?: string | number;
  masteryReq?: string | number;
  aura?: string;
  polarities?: string[];
  type?: string;
  category?: string;
  introduced?: { name?: string; date?: string };
  location?: string;
  tradable?: boolean;
  url?: string;
  wikiaUrl?: string;
  prime_health?: number;
  prime_shield?: number;
  prime_armor?: number;
  prime_power?: string;
  prime_speed?: string;
  prime_mr?: string;
  prime_aura?: string;
  prime_url?: string;
};

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

function toImageUrl(raw: ApiWarframe): string {
  if (raw.thumbnail) return raw.thumbnail;
  if (raw.wikiaThumbnail) return raw.wikiaThumbnail;
  if (raw.imageName) return `https://cdn.warframestat.us/img/${raw.imageName}`;
  return "";
}

function toStringValue(value: string | number | undefined, fallback: string) {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

function mapWarframe(raw: ApiWarframe): Warframe {
  return {
    name: raw.name ?? "Unknown",
    uniqueName: raw.uniqueName ?? raw.name ?? "unknown",
    description: raw.description ?? "",
    thumbnail: toImageUrl(raw),
    health: raw.health ?? 0,
    shield: raw.shield ?? 0,
    armor: raw.armor ?? 0,
    power: raw.power ?? 0,
    speed: toStringValue(raw.speed ?? raw.sprintSpeed ?? raw.sprint, "-"),
    mr: toStringValue(raw.mr ?? raw.masteryReq, "0"),
    aura: raw.aura ?? "-",
    polarities: Array.isArray(raw.polarities) ? raw.polarities : [],
    type: raw.type ?? raw.category ?? "Warframe",
    introduced:
      raw.introduced?.name || raw.introduced?.date
        ? {
            name: raw.introduced?.name ?? "",
            date: raw.introduced?.date ?? "",
          }
        : undefined,
    location: raw.location,
    tradable: Boolean(raw.tradable),
    url: raw.url ?? raw.wikiaUrl ?? "",
    prime_health: raw.prime_health,
    prime_shield: raw.prime_shield,
    prime_armor: raw.prime_armor,
    prime_power: raw.prime_power,
    prime_speed: raw.prime_speed,
    prime_mr: raw.prime_mr,
    prime_aura: raw.prime_aura,
    prime_url: raw.prime_url,
  };
}

export function useWarframes() {
  const [data, setData] = useState<Warframe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadWarframes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE}/warframes?language=en`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const json: unknown = await response.json();
        if (!Array.isArray(json)) {
          throw new Error("Unexpected response format.");
        }

        const mapped = json.map((item) => mapWarframe(item as ApiWarframe));
        const playable = mapped.filter(
          (w) =>
            Boolean(w.name) &&
            Boolean(w.thumbnail) &&
            !w.uniqueName.toLowerCase().includes("specter"),
        );

        setData(playable);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Failed to load Warframes.");
      } finally {
        setLoading(false);
      }
    };

    loadWarframes();

    return () => controller.abort();
  }, []);

  return { data, loading, error };
}

export function useWarframe(query: string) {
  const [data, setData] = useState<Warframe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    const loadWarframe = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${BASE}/warframes/${encodeURIComponent(query)}?language=en`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const json: unknown = await response.json();
        setData(mapWarframe(json as ApiWarframe));
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Failed to load Warframe.");
      } finally {
        setLoading(false);
      }
    };

    loadWarframe();

    return () => controller.abort();
  }, [query]);

  return { data, loading, error };
}
