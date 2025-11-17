// Chrome returns undefined, Firefox false
await page.evaluateOnNewDocument(() => {
  try {
    if (window.outerWidth && window.outerHeight) {
      return; // nothing to do here
    }
    const windowFrame = 85; // probably OS and WM dependent
    window.outerWidth = window.innerWidth;
    window.outerHeight = window.innerHeight + windowFrame;
  } catch (err) {}
});
