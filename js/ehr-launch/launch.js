// launch.js – reusable SMART on FHIR launch helper
// ----------------------------------------------------
// Usage example in HTML:
// <script src="launch.js" defer></script>
// <script defer>
//   document.addEventListener('DOMContentLoaded', async () => {
//     const ctx = parseSmartLaunch({ debug: true });      // 1️⃣ Parse launch params
//     setTimeout(() => fetchSmartConfig(ctx.iss, {        // 2️⃣ Wait 3 s then fetch
//       debug: true                                       //     the SMART metadata
//     }), 3000);
//   });
// </script>

(function (global) {
  "use strict";

  /* -------------------------------------------------- */
  /* Utility helpers                                    */
  /* -------------------------------------------------- */

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  // Generate a cryptographically secure random string (PKCE code verifier)
  function generateCodeVerifier() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  // Hash the verifier to create a S256 code challenge (not used in POST‑only example below)
  async function generateCodeChallenge(verifier) {
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(verifier)
    );
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  /* -------------------------------------------------- */
  /* Step 1: Parse launch parameters                    */
  /* -------------------------------------------------- */
  /**
   * Parse SMART launch parameters from the query string and (optionally) display them.
   *
   * @param {Object}   [options]                     – Optional behavior flags.
   * @param {boolean}  [options.debug=false]         – Whether to pretty‑print parsed output.
   * @param {string}   [options.debugElId="debug"]   – Element ID to render JSON when debug is on.
   * @returns {Object} The parsed launch context.
   */
  function parseSmartLaunch(options = {}) {
    const { debug = false, debugElId = "debug" } = options;

    const qs = new URLSearchParams(global.location.search);
    const context = {
      iss: qs.get("iss"),
      launch: qs.get("launch"),
      aud: qs.get("aud"),
      scope: qs.get("scope"),
      patient: qs.get("patient"),
      encounter: qs.get("encounter"),
      provider: qs.get("provider"),
      code: qs.get("code"),
    };

    sessionStorage.setItem("smartLaunchContext", JSON.stringify(context));

    if (debug) {
      const el = global.document.getElementById(debugElId);
      if (el) {
        el.textContent =
          `STEP 1: Parse launch parameters\n` +
          JSON.stringify(context, null, 2);
        el.classList.remove("hidden");
      }
    }

    return context;
  }

  /* -------------------------------------------------- */
  /* Step 2: Fetch .well-known/smart-configuration      */
  /* -------------------------------------------------- */
  /**
   * Fetch the SMART on FHIR server's well‑known configuration after an optional delay.
   *
   * @param {string}  iss                        – The base FHIR URL (from launch context).
   * @param {Object} [options]                   – Optional flags.
   * @param {boolean} [options.debug=false]      – Append the JSON to the debug element.
   * @param {string}  [options.debugElId="debug"] – Element ID where JSON should be rendered.
   * @returns {Promise<Object|null>} Parsed JSON or null on error.
   */
  async function fetchSmartConfig(iss, options = {}) {
    const { debug = false, debugElId = "debug" } = options;
    if (!iss) {
      console.error(
        "fetchSmartConfig: 'iss' is required but was missing or empty."
      );
      return null;
    }

    const url = `${iss.replace(/\/$/, "")}/.well-known/smart-configuration`;
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/fhir+json",
          "Epic-Client-ID": "0000-0000-0000-0000-0000",
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();

      if (debug) {
        const el = global.document.getElementById(debugElId);
        if (el) {
          el.textContent +=
            `\n\nSTEP 2: Retrieve SMART Configuration (from ${url}):\n` +
            JSON.stringify(json, null, 2);
        }
      }

      return json;
    } catch (err) {
      console.error("Failed to fetch SMART configuration:", err);
      return null;
    }
  }

  /* -------------------------------------------------- */
  /* Step 3: POST to /authorize to request auth code    */
  /* -------------------------------------------------- */
  /**
   * Programmatically POST a form to the authorization endpoint to request a SMART auth code.
   *
   * @param {string} actionUrl - The full URL of the SMART `authorization_endpoint`.
   * @param {Object} params - An object containing key-value pairs to submit.
   * @returns {void} This function causes a navigation and does not return.
   */
  function postAuthorizationForm(actionUrl, params) {
    const form = global.document.createElement("form");
    form.method = "POST";
    form.enctype = "application/x-www-form-urlencoded";
    form.action = actionUrl;

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const input = global.document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
    });

    global.document.body.appendChild(form);
    form.submit();
  }

  /* -------------------------------------------------- */
  /* Orchestrator: run full launch flow                 */
  /* -------------------------------------------------- */
  async function startSmartLaunchFlow({
    clientId,
    redirectUri,
    debug = false,
    debugElId = "debug",
  } = {}) {
    if (!clientId || !redirectUri) {
      throw new Error(
        "startSmartLaunchFlow: 'clientId' and 'redirectUri' are required."
      );
    }

    // 1️⃣ Parse launch params
    const ctx = parseSmartLaunch({ debug, debugElId });

    // 2️⃣ Wait 3 seconds, then fetch SMART configuration
    await sleep(3000);
    const smartConfig = await fetchSmartConfig(ctx.iss, { debug, debugElId });
    if (!smartConfig) return;

    const authorizeUrl = smartConfig.authorization_endpoint;

    // 3️⃣ Generate state (and optionally PKCE)
    const state = crypto.randomUUID();

    // Optionally store values for later token exchange
    sessionStorage.setItem("oauth_state", state);

    // 4️⃣ Wait another 3 seconds, then POST to /authorize
    await sleep(3000);

    const params = {
      scope: "launch", // add additional scopes as needed
      response_type: "code",
      redirect_uri: redirectUri,
      client_id: clientId,
      launch: ctx.launch,
      state: state,
      aud: ctx.iss,
      // Uncomment below if using PKCE
      // code_challenge: await generateCodeChallenge(codeVerifier),
      // code_challenge_method: "S256",
    };

    if (debug)
      console.log("POSTing authorization request to", authorizeUrl, params);

    sessionStorage.setItem("smart_token_endpoint", smartConfig.token_endpoint);
    sessionStorage.setItem("smart_client_id", clientId);
    sessionStorage.setItem("smart_redirect_uri", redirectUri);
    sessionStorage.setItem("pkce_code_verifier", state); // optional
    sessionStorage.setItem('fhirConfig', JSON.stringify(
      {
        endpointUrl: ctx.iss + '/',
        metaUrl: ctx.iss + '/metadata'
      }
    ));


    postAuthorizationForm(authorizeUrl, params);
  }

  /* -------------------------------------------------- */
  /* Step 4: Parse auhorization code from redirect      */
  /* -------------------------------------------------- */
  function parseSmartRedirect(options = {}) {
    const { debug = false, debugElId = "debug" } = options;

    const qs = new URLSearchParams(global.location.search);
    const context = {
      code: qs.get("code"),
    };

    sessionStorage.setItem("smartLaunchContext", JSON.stringify(context));

    if (debug) {
      const el = global.document.getElementById(debugElId);
      if (el) {
        el.textContent =
          `STEP 4: Parse authorization code from redirect\n` +
          JSON.stringify(context, null, 2);
        el.classList.remove("hidden");
      }
    }

    return context;
  }

  async function exchangeAuthCode(ctx = {}, options = {}) {
    const { debug = false, debugElId = "debug" } = options;

    const tokenUrl = sessionStorage.getItem("smart_token_endpoint");
    const clientId = sessionStorage.getItem("smart_client_id");
    const redirectUri = sessionStorage.getItem("smart_redirect_uri");
    const codeVerifier = sessionStorage.getItem("pkce_code_verifier"); // may be null

    if (!tokenUrl || !clientId || !redirectUri) {
      console.error("Required tokenUrl or clientId or redirectUri not found in sessionStorage.");
      return;
    }

    const bodyParams = {
      grant_type: "authorization_code",
      code: ctx.code,
      redirect_uri: redirectUri,
      client_id: clientId,
    };
    //if (codeVerifier) bodyParams.code_verifier = codeVerifier;

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams(bodyParams).toString(),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();

    if (debug) {
      const el = global.document.getElementById(debugElId);
      if (el) {
        el.textContent +=
          `\n\nSTEP 5: Exchange authorization code for access token\n` +
          JSON.stringify(json, null, 2);
        el.classList.remove("hidden");
      }
    }
    return json;
  }

  async function startSmartRedirectFlow() {
    // Step 4: Display the returned parameters (code, state, etc.)
    const ctx = parseSmartRedirect({ debug: true });
    console.log('ctx: ', ctx);
    if (!ctx.code) {
      console.error("No authorization code found in redirect URL.");
      return;
    }

    // Step 5: Exchange code for token and display response
    const response = await exchangeAuthCode(ctx, { debug: true });
    const accessToken = response.access_token
    const patient = response.patient
    sessionStorage.setItem('oauthCode', ctx.code)
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('patient', patient);

    // Step 6: Redirect the browser to Atlas Health
    await sleep(3000);
    window.location.href = 'https://pftechsln.github.io/fhirData.html';
  }

  /* -------------------------------------------------- */
  /* Expose functions globally                          */
  /* -------------------------------------------------- */
  global.parseSmartLaunch = parseSmartLaunch;
  global.fetchSmartConfig = fetchSmartConfig;
  global.startSmartLaunchFlow = startSmartLaunchFlow;
  global.parseSmartRedirect = parseSmartRedirect;
  global.exchangeAuthCode = exchangeAuthCode;
  global.startSmartRedirectFlow = startSmartRedirectFlow;
})(window);
