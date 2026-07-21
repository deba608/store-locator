import { NextResponse } from "next/server";

interface AutocompleteSuggestion {
  placeId: string;
  text: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("input")?.trim();
  const mode = searchParams.get("mode") === "pincode" ? "pincode" : "address";

  if (!input || input.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
      },
      body: JSON.stringify({
        input,
        includedPrimaryTypes: mode === "pincode" ? ["postal_code"] : undefined,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ suggestions: [] });
    }

    const data = await res.json();
    const suggestions: AutocompleteSuggestion[] = (data.suggestions ?? [])
      .map((s: { placePrediction?: { placeId: string; text?: { text: string } } }) => {
        const p = s.placePrediction;
        if (!p) return null;
        return { placeId: p.placeId, text: p.text?.text ?? "" };
      })
      .filter((s: AutocompleteSuggestion | null): s is AutocompleteSuggestion => !!s && !!s.text)
      .slice(0, 6);

    return NextResponse.json({ suggestions });
  } catch (e) {
    console.error("autocomplete failed:", e);
    return NextResponse.json({ suggestions: [] });
  }
}
