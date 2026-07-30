const slug = (s) => s.replace(/\s+/g, "_").toLowerCase();

export const chartKeyFor = (patientName) => `dentalclub_chart_${slug(patientName)}`;

export const createDefaultChart = () =>
  Array.from({ length: 32 }).reduce((acc, _, i) => {
    acc[i + 1] = 0;
    return acc;
  }, {});

  export const resetChart = (patient) => {
  deleteChart(patient);           // clears the saved chart
  return { teeth: {}, bleeding: {} };
};

// The demo data your app used to hardcode per-patient, kept here so first
// load still looks populated instead of a blank all-healthy chart.
const DEMO_TEETH = {
  "John Doe": { 4: 1, 14: 1, 19: 2, 32: 2 },
  "Jane Smith": { 8: 1, 9: 1, 24: 1, 2: 2, 3: 2 },
  "Alex Mercer": { 12: 1, 5: 2, 18: 2, 30: 2 },
};

const buildDemoChart = (patientName) => {
  const base = createDefaultChart();
  const overrides = DEMO_TEETH[patientName] || {};
  return { ...base, ...overrides };
};

/**
 * Returns the saved chart for a patient. If nothing has ever been saved for
 * them yet, seeds localStorage with demo data (or an all-healthy chart for
 * unknown names) so both dashboards start from the same place.
 */
export const loadChart = (patientName) => {
  try {
    const raw = localStorage.getItem(chartKeyFor(patientName));
    if (raw) return JSON.parse(raw);
  } catch {
    // fall through to seeding
  }

  const seeded = {
    teeth: buildDemoChart(patientName),
    bleeding: {},
    updatedAt: null,
  };
  localStorage.setItem(chartKeyFor(patientName), JSON.stringify(seeded));
  return seeded;
};

export const saveChart = (patientName, teeth, bleeding) => {
  const payload = { teeth, bleeding, updatedAt: new Date().toISOString() };
  localStorage.setItem(chartKeyFor(patientName), JSON.stringify(payload));
  return payload;
};

export const deleteChart = (patientName) => {
  localStorage.removeItem(chartKeyFor(patientName));
};