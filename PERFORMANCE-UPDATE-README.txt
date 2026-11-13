PORTFOLIO PERFORMANCE UPDATE

Changes made after inspecting the supplied project:
- Made the Google Fonts stylesheet non-render-blocking while retaining a no-JavaScript fallback. Removed the unused Instrument Serif italic variant.
- Corrected Netlify _headers patterns to match root-level CSS/JS files and the actual profile/resume paths. Unversioned CSS/JS use a one-day cache, not immutable caching. HTML revalidates.
- Optimized profile.jpg to profile.webp and updated about.html.
- Deferred pointer-effect layout measurements to requestAnimationFrame and removed getBoundingClientRect fallback reads from pointermove handlers.
- Corrected absolute GitHub and LinkedIn URLs in the Person JSON-LD sameAs array.

DEPLOY
1. Extract this ZIP.
2. Deploy the contents of the portfolio folder (the files inside it) to the Netlify site, preserving the root-level structure.
3. Test Home, About, Skills, Projects and Contact on desktop and mobile. Check that the About portrait loads.
4. Re-run PageSpeed Insights for the same URL/device/network settings. Lighthouse scores can vary between runs.

NOTES
- The main CSS files remain normal stylesheets because they are needed to render the page without a flash of unstyled content.
- The PageSpeed warning labels alone do not reveal every exact network request or script stack. Use the expanded audit details/trace to confirm which items remain.
