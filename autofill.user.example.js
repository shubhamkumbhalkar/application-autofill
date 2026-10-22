// ==UserScript==
// @name         Application Autofill (review-first)
// @namespace    shubhamkumbhalkar.autofill
// @version      1.0
// @description  Fills Greenhouse / Lever / Ashby job-application forms from your local profile. Highlights what it filled and NEVER submits — you review and click Submit yourself.
// @match        https://boards.greenhouse.io/*
// @match        https://job-boards.greenhouse.io/*
// @match        https://*.lever.co/*
// @match        https://jobs.ashbyhq.com/*
// @match        https://*.ashbyhq.com/*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
  "use strict";

  // ---- Your profile. Edit these values once (Tampermonkey: edit this script). ----
  // Nothing here is secret beyond normal application data; it stays in your browser only.
  const PROFILE = {
    first_name: "Your First",
    last_name: "Your Last",
    full_name: "Your Full Name",
    email: "you@example.com",
    phone: "",                       // <-- fill your phone
    location: "City, ST",
    linkedin: "https://www.linkedin.com/in/your-handle/",
    github: "https://github.com/your-handle",
    portfolio: "https://your-site.example",
    website: "https://your-site.example",
    current_company: "Your Company",
    current_title: "Your Title",
    // Common screening answers (used for selects/radios where the label matches):
    work_authorization: "Yes",       // authorized to work in the US
    require_sponsorship: "No",        // adjust to your real situation
    years_experience: "N",
    // Free-text fallbacks for "additional info" style boxes (left blank by default):
    summary: ""
  };

  // label/name keyword -> profile key
  const MAP = [
    [["first name", "firstname", "given name"], "first_name"],
    [["last name", "lastname", "family name", "surname"], "last_name"],
    [["full name", "your name", "name"], "full_name"],
    [["email"], "email"],
    [["phone", "mobile", "telephone"], "phone"],
    [["location", "city", "where are you based"], "location"],
    [["linkedin"], "linkedin"],
    [["github"], "github"],
    [["portfolio", "personal site", "personal website"], "portfolio"],
    [["website", "url"], "website"],
    [["current company", "employer"], "current_company"],
    [["current title", "job title", "current role"], "current_title"],
    [["authorized to work", "work authorization", "legally authorized"], "work_authorization"],
    [["require sponsorship", "need sponsorship", "visa sponsorship"], "require_sponsorship"],
    [["years of experience", "years experience"], "years_experience"],
  ];

  function labelFor(el) {
    let t = "";
    if (el.id) {
      const l = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (l) t += " " + l.innerText;
    }
    let p = el.closest("div,fieldset,li,section");
    if (p) {
      const lab = p.querySelector("label");
      if (lab) t += " " + lab.innerText;
    }
    t += " " + (el.name || "") + " " + (el.getAttribute("aria-label") || "") +
         " " + (el.placeholder || "");
    return t.toLowerCase();
  }

  function pick(text) {
    for (const [keys, key] of MAP) {
      if (keys.some(k => text.includes(k)) && PROFILE[key]) return PROFILE[key];
    }
    return null;
  }

  function setValue(el, val) {
    const proto = el.tagName === "TEXTAREA"
      ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
    setter.call(el, val);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.style.outline = "2px solid #22c55e";   // green = filled by script
    el.title = "Autofilled — review before submitting";
  }

  function fillSelect(el, val) {
    const v = val.toLowerCase();
    for (const opt of el.options) {
      if (opt.text.toLowerCase().trim() === v || opt.value.toLowerCase() === v) {
        el.value = opt.value;
        el.dispatchEvent(new Event("change", { bubbles: true }));
        el.style.outline = "2px solid #22c55e";
        return true;
      }
    }
    return false;
  }

  function run() {
    let n = 0;
    document.querySelectorAll("input[type=text], input[type=email], input[type=tel], input[type=url], input:not([type]), textarea")
      .forEach(el => {
        if (el.value || el.disabled || el.readOnly) return;
        const val = pick(labelFor(el));
        if (val) { setValue(el, val); n++; }
      });
    document.querySelectorAll("select").forEach(el => {
      if (el.value && el.selectedIndex > 0) return;
      const val = pick(labelFor(el));
      if (val && fillSelect(el, val)) n++;
    });
    banner(`Autofilled ${n} field(s). Green outline = filled. Review everything, then submit yourself.`);
  }

  function banner(msg) {
    let b = document.getElementById("__autofill_banner");
    if (!b) {
      b = document.createElement("div");
      b.id = "__autofill_banner";
      b.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:999999;background:#0a0a0f;color:#e4e4e7;" +
        "padding:10px 16px;font:14px Inter,sans-serif;border-bottom:2px solid #22c55e;text-align:center;";
      document.body.appendChild(b);
    }
    b.textContent = "🤖 " + msg + "  (this tool never submits for you)";
  }

  // Button + Tampermonkey menu, so YOU trigger the fill (nothing happens automatically).
  const btn = document.createElement("button");
  btn.textContent = "🤖 Autofill application";
  btn.style.cssText = "position:fixed;bottom:20px;right:20px;z-index:999999;background:#6366f1;color:#fff;" +
    "border:none;border-radius:8px;padding:12px 16px;font:600 14px Inter,sans-serif;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.3);";
  btn.onclick = run;
  window.addEventListener("load", () => document.body.appendChild(btn));
  if (typeof GM_registerMenuCommand === "function") GM_registerMenuCommand("Autofill this application", run);
})();
