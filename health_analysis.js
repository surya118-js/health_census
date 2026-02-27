// health_analysis.js
// Loads health_analysis.json and provides search + card rendering

let healthData = [];

// Fetch JSON data on page load
fetch('health_analysis.json')
  .then(response => {
    if (!response.ok) throw new Error('Could not load health data.');
    return response.json();
  })
  .then(data => {
    healthData = data.conditions || data;
    renderCards(healthData);
  })
  .catch(err => console.error('Error loading JSON:', err));

// ── Render featured condition cards ──────────────────────────────────────────
function renderCards(conditions) {
  const grid = document.getElementById('cardsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  conditions.forEach(cond => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${cond.imagesrc || 'thyroid.jpg'}" alt="${cond.condition}" onerror="this.style.display='none'"/>
      <div class="card-body">
        <h4>${cond.condition}</h4>
        <p>${(cond.symptoms || []).slice(0, 3).join(', ')}${cond.symptoms && cond.symptoms.length > 3 ? '…' : ''}</p>
        <span class="tag">Learn More</span>
      </div>
    `;
    card.addEventListener('click', () => displayResult(cond));
    grid.appendChild(card);
  });
}

// ── Search handler ────────────────────────────────────────────────────────────
function searchCondition() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!query) {
    clearResult();
    return;
  }

  const found = healthData.find(c => c.condition.toLowerCase().includes(query));

  if (found) {
    displayResult(found);
  } else {
    document.getElementById('result').innerHTML = `
      <div class="result-card">
        <h3>No results found for "<em>${query}</em>"</h3>
        <p>Try searching for: thyroid, diabetes, or blood_pressure.</p>
      </div>`;
  }

  document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
}

// ── Display a condition's full details ────────────────────────────────────────
function displayResult(cond) {
  const symptoms   = listItems(cond.symptoms);
  const prevention = listItems(cond.prevention);
  const treatment  = listItems(cond.treatment);

  document.getElementById('result').innerHTML = `
    <div class="result-card">
      <h3>${cond.condition}</h3>

      <h4>🩺 Symptoms</h4>
      <ul>${symptoms}</ul>

      <h4>🛡️ Prevention</h4>
      <ul>${prevention}</ul>

      <h4>💊 Treatment</h4>
      <ul>${treatment}</ul>
    </div>`;

  document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
}

// ── Helper: build <li> list from array ───────────────────────────────────────
function listItems(arr) {
  if (!arr || arr.length === 0) return '<li>Information not available.</li>';
  return arr.map(item => `<li>${item}</li>`).join('');
}

// ── Clear result panel ────────────────────────────────────────────────────────
function clearResult() {
  document.getElementById('result').innerHTML = '';
}

// Allow pressing Enter in the search box
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') searchCondition();
    });
  }
});