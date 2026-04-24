console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
  { url: 'https://github.com/karsan377', title: 'GitHub' } // Replace with your actual GitHub URL
];

let nav = document.createElement('nav');
document.body.prepend(nav);

// Dynamically set the base path based on whether the site is hosted in a subfolder (like /portfolio/)
// This fixes the "Cannot GET" error when Live Server is opened from a parent directory.
const BASE_PATH = location.pathname.startsWith("/portfolio/") ? "/portfolio/" : "/";

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  url = !url.startsWith('http') ? BASE_PATH + url : url;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;

  // Normalize paths so the 'current' class highlights correctly even if index.html is in the URL
  let currentPath = location.pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "");
  let linkPath = a.pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "");

  if (a.host === location.host && currentPath === linkPath) {
    a.classList.add('current');
  }

  if (a.host !== location.host) {
    a.target = "_blank";
  }

  nav.append(a);
}

nav.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>`
);

let select = document.querySelector('.color-scheme select');

if ("colorScheme" in localStorage) {
  document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
  select.value = localStorage.colorScheme;
}

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  document.documentElement.style.setProperty('color-scheme', event.target.value);
  localStorage.colorScheme = event.target.value;
});

let form = document.querySelector('form');
form?.addEventListener('submit', function (event) {
  event.preventDefault();
  let data = new FormData(form);
  let url = form.action + "?" + new URLSearchParams(data).toString();
  location.href = url;
});

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Attempt to read error message from response body if available
      const errorBody = await response.text();
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText} - ${errorBody}`);
    }
    // Check if the response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
      console.warn(`Response from ${url} was not JSON. Content-Type: ${contentType}`);
      return await response.text(); // Return text if not JSON, or throw an error if JSON is strictly expected
    }
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
    throw error; // Re-throw the error to allow calling functions to handle it
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';
  for (let project of projects) {
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;
    containerElement.appendChild(article);
  }
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}