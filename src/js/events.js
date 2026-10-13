document.addEventListener('DOMContentLoaded', () => {
  const cityFilter = document.getElementById('city-filter');
  const venueFilter = document.getElementById('venue-filter');
  const dateFilter = document.getElementById('date-filter');
  const resetBtn = document.getElementById('reset-filters');
  const eventsGrid = document.getElementById('events-grid');
  const eventsCount = document.getElementById('events-count');

  let events = [];

  async function loadEvents() {
    const response = await fetch('../data/events.json');
    events = await response.json();
    populateFilters();
    renderEvents();
  }

  function populateFilters() {
    const cities = [...new Set(events.map(e => e.city))].sort();
    const venues = [...new Set(events.map(e => e.venue))].sort();

    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      cityFilter.appendChild(option);
    });

    venues.forEach(venue => {
      const option = document.createElement('option');
      option.value = venue;
      option.textContent = venue;
      venueFilter.appendChild(option);
    });
  }

  function getFilteredEvents() {
    const city = cityFilter.value;
    const venue = venueFilter.value;
    const date = dateFilter.value;

    return events.filter(event => {
      if (city && event.city !== city) return false;
      if (venue && event.venue !== venue) return false;
      if (date && event.date !== date) return false;
      return true;
    });
  }

  function formatPrice(price) {
    return price.toLocaleString('uz-UZ') + ' UZS';
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  function renderEvents() {
    const filtered = getFilteredEvents();
    eventsCount.textContent = `Showing ${filtered.length} of ${events.length} events`;

    if (filtered.length === 0) {
      eventsGrid.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1;">
          <h2>No events found</h2>
          <p>Try adjusting your filters to find what you're looking for.</p>
        </div>
      `;
      return;
    }

    eventsGrid.innerHTML = filtered
      .map(
        event => `
      <div class="event-card">
        <img src="${event.poster}" alt="${event.title}" loading="lazy">
        <div class="card-body">
          <h3>${event.title}</h3>
          <div class="meta">
            <span class="tag">${event.genre}</span>
            <span class="tag">${event.duration}</span>
            <span class="tag">${event.rating}</span>
          </div>
          <p class="description">${event.description}</p>
          <div class="meta">
            <span class="tag">${formatDate(event.date)} · ${event.time}</span>
            <span class="tag">${event.city} · ${event.venue}</span>
          </div>
          <div class="card-footer">
            <span class="price">${formatPrice(event.price)}</span>
            <button class="buy-btn" data-event-id="${event.id}">Buy Ticket</button>
          </div>
        </div>
      </div>
    `
      )
      .join('');
  }

  cityFilter.addEventListener('change', renderEvents);
  venueFilter.addEventListener('change', renderEvents);
  dateFilter.addEventListener('change', renderEvents);

  resetBtn.addEventListener('click', () => {
    cityFilter.value = '';
    venueFilter.value = '';
    dateFilter.value = '';
    renderEvents();
  });

  eventsGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('buy-btn')) {
      const eventId = e.target.dataset.eventId;
      const event = events.find(ev => ev.id === parseInt(eventId));
      if (event) {
        alert(`Redirecting to seat selection for "${event.title}"...\nThis feature is coming soon!`);
      }
    }
  });

  loadEvents();
});
