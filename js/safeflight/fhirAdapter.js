// js/safeflight/fhirAdapter.js
export async function fetchPatientData(baseUrl, patientId, accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json+fhir'
  };

  const [condBundle, procBundle] = await Promise.all([
    fetchResource(`${baseUrl}Condition?patient=${patientId}&_count=100`, headers),
    fetchResource(`${baseUrl}Procedure?patient=${patientId}&_count=100`, headers)
  ]);

  return {
    conditions: normalizeConditions(condBundle),
    procedures: normalizeProcedures(procBundle)
  };
}

async function fetchResource(url, headers) {
  try {
    const resp = await fetch(url, { headers });
    if (!resp.ok) return { entry: [] };
    return await resp.json();
  } catch {
    return { entry: [] };
  }
}

function normalizeConditions(bundle) {
  return (bundle.entry || [])
    .map(e => e.resource)
    .filter(r => r?.code?.coding?.length > 0 && r.code.coding[0].code)
    .map(r => ({
      code:           r.code.coding[0].code,
      system:         'icd10',
      display:        r.code.coding[0].display || r.code.text || '',
      clinicalStatus: mapClinicalStatus(r.clinicalStatus),
      onsetDate:      r.onsetDateTime || null
    }));
}

function normalizeProcedures(bundle) {
  return (bundle.entry || [])
    .map(e => e.resource)
    .filter(r =>
      r?.code?.coding?.length > 0 &&
      r.code.coding[0].code &&
      r.status !== 'entered-in-error'
    )
    .map(r => ({
      code:          r.code.coding[0].code,
      system:        'snomed',
      display:       r.code.coding[0].display || r.code.text || '',
      status:        mapProcedureStatus(r.status),
      performedDate: r.performedDateTime || r.performedPeriod?.end || null
    }));
}

function mapClinicalStatus(raw) {
  if (!raw || raw === 'active' || raw === 'relapse') return 'active';
  if (raw === 'remission') return 'recurrent';
  if (raw === 'resolved')  return 'resolved';
  return 'active';
}

function mapProcedureStatus(raw) {
  if (raw === 'completed')   return 'completed';
  if (raw === 'in-progress') return 'in-progress';
  return 'stopped';
}

export async function exchangeCodeForToken(tokenUrl, code, clientId, redirectUri) {
  const body = new URLSearchParams({
    grant_type:   'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id:    clientId
  });

  const resp = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  if (!resp.ok) throw new Error(`Token exchange failed: ${resp.status}`);
  return await resp.json();
}

export async function discoverOAuthEndpoints(fhirBaseUrl) {
  const cacheKey = `sf_oauth_${fhirBaseUrl}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  const resp = await fetch(`${fhirBaseUrl}metadata`, {
    headers: { Accept: 'application/json+fhir' }
  });
  const conformance = await resp.json();

  const secExt = conformance.rest?.[0]?.security?.extension
    ?.find(e => e.url === 'http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris');

  const authUrl  = secExt?.extension?.find(e => e.url === 'authorize')?.valueUri;
  const tokenUrl = secExt?.extension?.find(e => e.url === 'token')?.valueUri;

  if (!authUrl || !tokenUrl) throw new Error('OAuth endpoints not found in metadata');

  const result = { authUrl, tokenUrl };
  sessionStorage.setItem(cacheKey, JSON.stringify(result));
  return result;
}
