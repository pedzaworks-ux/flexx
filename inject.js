(function () {
  const FRAG = "header-footer.html";
  const HIDE_CLASS = "header-footer-loading";
  document.body.classList.add(HIDE_CLASS);

  function injectFragment(htmlText) {
    const parser = new DOMParser();
    const fragDoc = parser.parseFromString(htmlText, "text/html");

    // ✅ Copy all <link rel="stylesheet"> and <style> into <head>
    fragDoc.querySelectorAll('link[rel="stylesheet"], style').forEach(node => {
      if (node.tagName === "LINK") {
        // avoid duplicates
        if (!document.head.querySelector(`link[href="${node.href}"]`)) {
          document.head.appendChild(node.cloneNode(true));
        }
      } else if (node.tagName === "STYLE") {
        const txt = node.textContent || "";
        // avoid duplicate inline styles
        if (
          txt &&
          !Array.from(document.head.querySelectorAll("style")).some(
            s => s.textContent === txt
          )
        ) {
          const st = document.createElement("style");
          st.textContent = txt;
          document.head.appendChild(st);
        }
      }
    });

    // ✅ Clone header/footer
    const hdr = fragDoc.querySelector("header")?.cloneNode(true);
    const nav = fragDoc.querySelector("nav")?.cloneNode(true);
    const ftr = fragDoc.querySelector("footer")?.cloneNode(true);

    const replaceOrInsert = (selector, node) => {
      if (!node) return;
      const existing = document.querySelector(selector);
      if (existing) existing.replaceWith(node);
      else {
        if (selector === "header")
          document.body.insertBefore(node, document.body.firstChild);
        else if (selector === "nav") {
          const hdrEl = document.querySelector("header");
          if (hdrEl) hdrEl.insertAdjacentElement("afterend", node);
          else document.body.insertBefore(node, document.body.firstChild);
        } else if (selector === "footer") document.body.appendChild(node);
      }
    };

    replaceOrInsert("header", hdr);
    replaceOrInsert("nav", nav);
    replaceOrInsert("footer", ftr);

    // ✅ Show body after styles load
    const links = Array.from(
      document.head.querySelectorAll('link[rel="stylesheet"]')
    );
    const promises = links.map(
      l => new Promise(res => { l.onload = res; })
    );
    Promise.all(promises).finally(() => {
      document.body.classList.remove(HIDE_CLASS);
      document.dispatchEvent(new Event("header-footer-loaded"));
      if (typeof window.updateCartCount === "function") window.updateCartCount();
    });
  }

  function init() {
    if (window.__headerFooterInjected) return;
    window.__headerFooterInjected = true;
    fetch(FRAG, { cache: "no-store" })
      .then(r => r.text())
      .then(html => injectFragment(html))
      .catch(err => {
        console.warn("Header-footer inject failed", err);
        document.body.classList.remove(HIDE_CLASS);
      });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
