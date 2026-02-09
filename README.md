# Keystone Informatics

A minimal, professional static website for Keystone Informatics. This site is designed to be deployed on Cloudflare Pages with no build step required.

## Overview

This is a plain HTML and CSS website focusing on informatics, analytics, and digital health. The site uses semantic HTML, responsive design, and accessible practices to provide a professional organizational presence.

## Structure

```
/
├── index.html          # Home page
├── about.html          # About page
├── focus.html          # Focus areas page
├── publications.html   # Publications page
├── contact.html        # Contact page
├── 404.html            # Custom 404 error page
├── styles.css          # Stylesheet
├── robots.txt          # Search engine directives
├── sitemap.xml         # Sitemap for search engines
└── README.md           # This file
```

## Local Preview

To preview the site locally:

1. Open `index.html` in your web browser
2. Navigate between pages using the navigation menu

That's it! No build tools, dependencies, or local server required. Simply open the HTML files directly in your browser.

## Deployment on Cloudflare Pages

### Initial Setup

1. Push this repository to GitHub (or GitLab/Bitbucket)
2. Log in to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Click "Create a project"
4. Connect your Git repository
5. Configure the project:
   - **Project name**: keystone-informatics (or your preferred name)
   - **Production branch**: main (or your default branch)
   - **Framework preset**: None
   - **Build command**: (leave empty)
   - **Build output directory**: / (root directory)
6. Click "Save and Deploy"

Cloudflare Pages will automatically deploy your site. Any future commits to your main branch will trigger automatic redeployments.

### Custom Domain

To use a custom domain:

1. Go to your Cloudflare Pages project
2. Navigate to "Custom domains"
3. Click "Set up a custom domain"
4. Follow the instructions to point your domain to Cloudflare Pages

Once configured, update the following placeholders in your files:
- `sitemap.xml`: Replace `https://yourdomain.com` with your actual domain
- `robots.txt`: Replace `https://yourdomain.com` with your actual domain
- All HTML files: Update the Open Graph `og:url` meta tags with your actual URLs
- `contact.html`: Replace `hello@yourdomain.com` with your actual email

## Updating Content

### Adding New Pages

1. Create a new HTML file (e.g., `newpage.html`)
2. Copy the structure from an existing page
3. Update the content and page-specific meta tags
4. Add a link to the new page in the `<nav>` section of all pages
5. Add the new page to `sitemap.xml`

### Editing Existing Pages

1. Open the HTML file you want to edit
2. Modify the content within the `<main>` section
3. Update the `<title>` and meta description if needed
4. Save the file

### Styling Changes

All styles are contained in `styles.css`. To modify the appearance:

1. Open `styles.css`
2. Locate the relevant section (e.g., colors, typography, layout)
3. Make your changes
4. Save the file

The CSS uses CSS custom properties (variables) defined in the `:root` selector for easy theme customization.

## SEO and Metadata

Each page includes:
- Title and meta description tags
- Open Graph meta tags for social sharing
- Semantic HTML structure
- `robots.txt` for search engine directives
- `sitemap.xml` for search engine indexing

Remember to update placeholder domains and email addresses before deploying to production.

## Accessibility

The site follows accessibility best practices:
- Semantic HTML elements
- Proper heading hierarchy
- Keyboard navigation support
- Focus indicators
- Color contrast ratios meeting WCAG guidelines
- Responsive design for various screen sizes

## Browser Support

This site uses standard HTML5 and CSS3 features supported by all modern browsers:
- Chrome, Edge, Firefox, Safari (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

No JavaScript is required, ensuring maximum compatibility and fast page loads.

## License

See LICENSE file for details.
