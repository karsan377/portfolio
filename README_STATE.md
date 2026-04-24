# Portfolio Status & Remaining Actions

## Current Repository State
Your repository has successfully been refactored to dynamically render data using JavaScript, pulling out the hardcoded HTML components.

- **`global.js`**: Now contains reusable `fetchJSON`, `renderProjects`, and `fetchGitHubData` functions.
- **`index.html` & `style.css`**: Contain your new Home Page project and GitHub statistics containers, along with the requested CSS Grid layout applied to `<dl>`.
- **`index.js`**: Fetches the top 3 objects out of the array for your Home page alongside pulling down active profile API statistics from GitHub.
- **`lib/projects.json`**: Holds placeholder data for 12 projects, structured with the required `year` fields (varying over several years).
- **`projects/projects.js`**: Contains the logic used exclusively on your dedicated Projects page to iterate through the entire JSON file and update the total project count.

---

## Actions to Perform Manually (Console Dev & HTML adjustments)

### 1. Extract Your Real Data (Step 1.1)
If you previously wrote hardcoded descriptions, titles, and image paths inside your `projects/index.html` page, you should open that page on the browser and extract it using the Developer Tools Console:
1. Open DevTools `(F12 or Cmd+Option+I)` and navigate to the **Console** tab.
2. Paste and run:
   ```javascript
   $$('.projects > article').map((a) => ({
     title: $('h2', a).textContent,
     image: $('img', a).getAttribute('src'),
     description: $('p', a).textContent,
   }));
   ```
3. Right-click the output array, click **"Copy object"**, and paste this data into `lib/projects.json` (replacing the placeholders I generated). Ensure you add a `"year"` string to each project.

### 2. Follow Classmates on GitHub (Step 3.0 & 3.2)
1. Ask at least 3 classmates to follow your GitHub account (and follow them back).
2. Open `/Users/karthik/Documents/GitHub/portfolio/index.js`.
3. Look for this line around line 13: `await fetchGitHubData('your-github-username');`
4. Change `'your-github-username'` to your actual GitHub handle to fetch your real statistics!

### 3. Update your Projects Page HTML (`projects/index.html`) (Step 1.5 & 1.6)
You will need to manually configure your Projects HTML document to integrate the script properly:
1. Include your scripts in the `<head>` tag:
   `<script src="../global.js" type="module"></script>`
   `<script src="projects.js" type="module"></script>`
2. Delete all the hardcoded `<article>` tags lying inside `<div class="projects">`.
3. Find the main page header tag (likely `<h1>Projects</h1>`) and attach the `projects-title` class: `<h1 class="projects-title">Projects</h1>`. This allows the script to inject the count correctly.



Separation of Concerns (Data & UI): You extracted all the hardcoded <article> elements from your HTML and moved the content into a dedicated lib/projects.json file. This means your data is now decoupled from your HTML.
Reusable JavaScript Utilities: You created fetchJSON and renderProjects functions inside global.js. This allows you to effortlessly render projects on any page (Home, Projects, etc.) without duplicating logic.
Array Slicing for Homepage: You used JavaScript array methods (.slice(0, 3)) inside index.js to parse your data and automatically feature only the top 3 latest projects on your homepage.
Live API Integration: You leveraged the fetch() API and Async/Await functions to pull down real-time stats from GitHub (fetchGitHubData). Now, every time someone views your page, it reflects your up-to-date follower, gist, and repository count automatically!
Dynamic DOM Manipulation: Using Template Literals (${}), you safely parsed the JSON object into HTML strings. You also added an automatic project counter on the Projects page that calculates the total length of the projects array and injects it right into the page's <h1> title!
Advanced CSS Grid Implementation: You formatted the newly injected GitHub statistics by targeting the definition list (<dl>) in your CSS and using grid-template-columns to create a clean, responsive layout.