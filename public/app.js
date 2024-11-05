let token = null;

// Register
async function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (response.ok) {
    alert('Registration successful! Please log in.');
  } else {
    alert(`Error: ${data.error}`);
  }
}

// Login
async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (response.ok) {
    token = data.token;
    alert('Login successful!');
    toggleSections();
  } else {
    alert(`Error: ${data.error}`);
  }
}

// Toggle sections visibility after login
function toggleSections() {
  document.getElementById('auth-section').classList.add('hidden');
  document.getElementById('shorten-section').classList.remove('hidden');
  document.getElementById('urls-section').classList.remove('hidden');
}

// Shorten URL
async function shortenURL() {
  const original_url = document.getElementById('original-url').value;
  const friendly_name = document.getElementById('friendly-name').value;

  const response = await fetch('/url/shorten', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ original_url, friendly_name })
  });

  const data = await response.json();
  if (response.ok) {
    alert(`URL shortened! Short URL: ${data.newURL.short_url}`);
    fetchURLs();
  } else {
    alert(`Error: ${data.error}`);
  }
}

// Fetch URLs with search/filter
async function fetchURLs() {
  const search = document.getElementById('search-friendly-name').value;
  const date = document.getElementById('search-date').value;

  const url = `/url/urls?search=${search}&date=${date}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (response.ok) {
    const urlsList = document.getElementById('urls-list');
    urlsList.innerHTML = '';
    data.urls.forEach(url => {
      urlsList.innerHTML += `
        <div id="url-${url.short_url}">
          <p><strong>Short URL:</strong> <a href="/url/${url.short_url}" target="_blank">${url.short_url}</a></p>
          <p><strong>Original URL:</strong> ${url.original_url}</p>
          <p><strong>Clicks:</strong> ${url.click_count}</p>
          <p><strong>Last Accessed:</strong> ${url.last_access || 'N/A'}</p>
          <input type="text" placeholder="New Original URL" id="update-original-url-${url.short_url}">
          <input type="text" placeholder="New Friendly Name" id="update-friendly-name-${url.short_url}">
          <button onclick="updateURL('${url.short_url}')">Update</button>
          <button onclick="deleteURL('${url.short_url}')">Delete</button>
        </div>`;
    });
  } else {
    alert(`Error: ${data.error}`);
  }
}

// Update URL
async function updateURL(short_url) {
  const original_url = document.getElementById(`update-original-url-${short_url}`).value;
  const friendly_name = document.getElementById(`update-friendly-name-${short_url}`).value;

  const response = await fetch(`/url/${short_url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ original_url, friendly_name })
  });

  if (response.ok) {
    alert('URL updated successfully');
    fetchURLs();
  } else {
    const data = await response.json();
    alert(`Error: ${data.error}`);
  }
}

// Delete URL
async function deleteURL(short_url) {
  const response = await fetch(`/url/${short_url}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    alert('URL deleted successfully');
    fetchURLs();
  } else {
    const data = await response.json();
    alert(`Error: ${data.error}`);
  }
}
