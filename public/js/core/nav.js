// Navigation helper shared by views (kept out of app.js to avoid cycles).
export function navigate(to) { location.hash = to.startsWith('#') ? to : `#/${to}`; }
