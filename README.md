# Keystone Neuroinformatics

A lightweight, multi-page static website for Keystone Neuroinformatics, built with vanilla HTML, CSS, and no frameworks.

## Overview

This site provides information about Keystone Neuroinformatics, our mission, focus areas, and contact information. The site is designed to be responsive, accessible, and deployable on Cloudflare Pages.

## Site Structure

- **index.html** - Homepage with welcome message and overview
- **about.html** - Information about our mission, approach, and values
- **focus.html** - Details about our key focus areas
- **contact.html** - Contact information and inquiry guidelines
- **styles-v2.css** - Responsive, accessible styling for all pages

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessible**: Built with WCAG accessibility guidelines in mind
  - Semantic HTML5 elements
  - ARIA labels for navigation
  - Keyboard navigation support
  - Focus indicators for interactive elements
  - Support for reduced motion preferences
  - High contrast mode support
- **Cross-browser Compatible**: Works on all modern browsers
- **Lightweight**: No frameworks or dependencies, fast load times
- **SEO Friendly**: Proper meta tags and semantic structure

## Deployment on Cloudflare Pages

### Prerequisites
- A Cloudflare account
- Git repository with the site files

### Deployment Steps

1. **Connect Your Repository**
   - Log in to your Cloudflare dashboard
   - Navigate to Pages
   - Click "Create a project"
   - Connect your GitHub/GitLab repository

2. **Configure Build Settings**
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: `/`
   - Root directory: (leave empty or specify if your files are in a subdirectory)

3. **Deploy**
   - Click "Save and Deploy"
   - Your site will be available at `https://your-project.pages.dev`

### Custom Domain (Optional)
1. In Cloudflare Pages, go to your project
2. Navigate to "Custom domains"
3. Add your custom domain
4. Update your DNS settings as instructed

## Local Development

To preview the site locally, you can use any static file server:

### Using Python
```bash
python -m http.server 8000
```

### Using Node.js (http-server)
```bash
npx http-server
```

### Using PHP
```bash
php -S localhost:8000
```

Then open your browser to `http://localhost:8000`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

This site follows web accessibility best practices:
- Proper heading hierarchy
- Alt text for images (when applicable)
- Keyboard navigation
- ARIA landmarks
- Sufficient color contrast
- Responsive font sizing
- Focus indicators

## License

See LICENSE file for details.

## Contributing

This is a static informational site. For updates or corrections, please submit issues or pull requests.
