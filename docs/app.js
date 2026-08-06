const externalLinks = document.querySelectorAll('a[target="_blank"]');

for (const link of externalLinks) {
  link.rel = "noopener noreferrer";
}
