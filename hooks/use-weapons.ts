import { useEffect, useState } from "react";

const BASE = "https://api.warframestat.us";

type ApiWeapon = {
  name?: string;
  uniqueName?: string;
  description?: string;
  thumbnail?: string;
  wikiaThumbnail?: string;
  imageName?: string;
  type?: string;
  category?: string;
  masteryReq?: number | string;
  totalDamage?: number | string;
  criticalChance?: number | string;
  accuracy?: number | string;
};

export type Weapon = {
  name: string;
  uniqueName: string;
  description: string;
  thumbnail: string;
  type: string;
  masteryReq: number;
  totalDamage: number;
  criticalChance: number;
  accuracy: number;
};

function toImageUrl(raw: ApiWeapon): string {
  if (raw.thumbnail) return raw.thumbnail;
  if (raw.wikiaThumbnail) return raw.wikiaThumbnail;
  if (raw.imageName) return `https://cdn.warframestat.us/img/${raw.imageName}`;
  return "";
}

function toNumberValue(value: string | number | undefined, fallback = 0) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function mapWeapon(raw: ApiWeapon): Weapon {
  return {
    name: raw.name ?? "Unknown",
    uniqueName: raw.uniqueName ?? raw.name ?? "unknown",
    description: raw.description ?? "",
    thumbnail: toImageUrl(raw),
    type: raw.type ?? raw.category ?? "Weapon",
    masteryReq: toNumberValue(raw.masteryReq),
    totalDamage: toNumberValue(raw.totalDamage),
    criticalChance: toNumberValue(raw.criticalChance),
    accuracy: toNumberValue(raw.accuracy),
  };
}

export function useWeapons(enabled = true) {
  const [data, setData] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!enabled || loaded) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadWeapons = async () => {
      setLoading(true);
      setError(null);

      try {
        const only = [
          "name",
          "uniqueName",
          "description",
          "type",
          "category",
          "thumbnail",
          "wikiaThumbnail",
          "imageName",
          "masteryReq",
          "totalDamage",
          "criticalChance",
          "accuracy",
        ].join(",");

        const response = await fetch(
          `${BASE}/weapons?language=en&only=${encodeURIComponent(only)}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const json: unknown = await response.json();
        if (!Array.isArray(json)) {
          throw new Error("Unexpected response format.");
        }

        const mapped = json.map((item) => mapWeapon(item as ApiWeapon));
        const usable = mapped.filter((w) => Boolean(w.name));

        setData(usable);
        setLoaded(true);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Failed to load Weapons.");
      } finally {
        setLoading(false);
      }
    };

    loadWeapons();

    return () => controller.abort();
  }, [enabled, loaded]);

  return { data, loading, error };
}
