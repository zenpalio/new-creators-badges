// Yoti Share callback - receives ?token= from Yoti, decrypts the receipt
// using the sandbox SDK, then redirects the user back to the app.
import Yoti from "npm:yoti@4.7.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APP_ORIGIN = Deno.env.get("APP_ORIGIN") ?? "https://id-preview--c237bc12-2acf-46a0-87db-894668bcb7be.lovable.app";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return Response.redirect(`${APP_ORIGIN}/?yoti_error=missing_token`, 302);
  }

  try {
    const sdkId = Deno.env.get("YOTI_SDK_ID");
    const pem = Deno.env.get("YOTI_PEM");
    if (!sdkId || !pem) throw new Error("Yoti credentials not configured");

    // Point the SDK at the Yoti sandbox API
    const yotiClient = new Yoti(sdkId, pem, {
      apiUrl: "https://api.yoti.com/sandbox/v1",
    });

    const activity = await yotiClient.getActivityDetails(token);
    const outcome = activity.getOutcome();
    const profile = activity.getProfile();
    const ageVerified = profile?.getAgeVerified?.()?.getValue?.();

    console.log("Yoti outcome:", outcome, "ageVerified:", ageVerified);

    if (outcome !== "SUCCESS") {
      return Response.redirect(`${APP_ORIGIN}/?yoti_error=${outcome}`, 302);
    }

    return Response.redirect(`${APP_ORIGIN}/?yoti_verified=1`, 302);
  } catch (err) {
    console.error("Yoti callback error:", err);
    const msg = encodeURIComponent(String(err?.message ?? err));
    return Response.redirect(`${APP_ORIGIN}/?yoti_error=decrypt_failed&msg=${msg}`, 302);
  }
});
