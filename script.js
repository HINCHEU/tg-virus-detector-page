// Language switch + the chat demo. The page works without this file (Khmer is shown).
(function () {
  "use strict";

  /* ---------------- Language ---------------- */
  const root = document.documentElement;
  const buttons = document.querySelectorAll("[data-set-lang]");

  function setLang(lang, save) {
    if (lang !== "km" && lang !== "en") return;
    root.dataset.lang = lang;
    root.lang = lang;
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setLang === lang)));
    if (save) {
      try { localStorage.setItem("lang", lang); } catch (_) { /* private mode */ }
    }
  }

  let initial = new URLSearchParams(location.search).get("lang");
  if (!initial) {
    try { initial = localStorage.getItem("lang"); } catch (_) { initial = null; }
  }
  setLang(initial || "km", false);
  buttons.forEach((b) => b.addEventListener("click", () => setLang(b.dataset.setLang, true)));

  /* ---------------- Chat demo ----------------
     Bot text is copied word-for-word from the bot's code. Only the EICAR
     result is a real scan, so only it links to a real VirusTotal report. */
  const chat = document.getElementById("chat");
  const picker = document.getElementById("picker");
  if (!chat || !picker) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EICAR_REPORT = "https://www.virustotal.com/gui/file/275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f";

  const report = (href) => href
    ? `<a class="msg__report" href="${href}" target="_blank" rel="noopener">Full VirusTotal report</a>`
    : `<span class="msg__report">Full VirusTotal report</span>`;

  const samples = {
    eicar: {
      name: "eicar-test.com", size: "68 B",
      steps: [
        (n) => `🚨 <b>WARNING — likely malicious</b><br><b>${n}</b> was flagged by 53 of 57 security vendors. <b>Do not open it.</b><br>${report(EICAR_REPORT)}`,
      ],
    },
    clean: {
      name: "notes.pdf", size: "1.2 MB",
      steps: [(n) => `✅ <b>${n}</b>: no security vendors flagged this file (0/62).<br>${report()}`],
    },
    caution: {
      name: "tool.zip", size: "3.8 MB",
      steps: [
        (n) => `⚠️ <b>Be careful</b><br><b>${n}</b>: 1 malicious and 0 suspicious detection(s) out of 62 engines. It may be a false positive, but only open it if you trust the sender.<br>${report()}`,
      ],
    },
    new: {
      name: "setup.exe", size: "2 KB",
      steps: [
        (n) => `⏳ <b>${n}</b> is new to VirusTotal and is being scanned now. The result will appear here in about 1–3 minutes. Don't open it yet.`,
        (n) => `✅ <b>${n}</b>: no security vendors flagged this file (0/60).<br>${report()}`,
      ],
    },
    private: {
      name: "contract.pdf", size: "4.3 MB",
      steps: [
        (n) => `ℹ️ <b>${n}</b> isn't in VirusTotal's database, so it can't be checked without uploading it. It was <b>not</b> uploaded, to keep it private.<br>Only open it if you trust the sender.`,
      ],
    },
  };

  const fileIcon =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" fill="currentColor" opacity=".95"/><path d="M14 3v5h5" stroke="#4FAE4E" stroke-width="1.6" stroke-linejoin="round"/></svg>';

  const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));
  const clock = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  let run = 0;

  function bubble(cls, html) {
    const el = document.createElement("div");
    el.className = `msg ${cls}`;
    el.lang = "en";
    el.innerHTML = html;
    chat.appendChild(el);
    while (chat.children.length > 6) chat.removeChild(chat.firstChild); // keep the demo short
    chat.scrollTop = chat.scrollHeight;
    return el;
  }

  async function play(key) {
    const s = samples[key];
    if (!s) return;
    const me = ++run;
    picker.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.sample === key)));

    bubble("msg--me",
      `<div class="file"><span class="file__icon">${fileIcon}</span><span><span class="file__name">${s.name}</span><br><span class="file__size">${s.size}</span></span></div><span class="msg__time">${clock()}</span>`);
    await wait(500);
    if (me !== run) return;

    const bot = bubble("msg--bot", `<span class="quote">${s.name}</span><span class="typing" aria-label="Scanning"><i></i><i></i><i></i></span>`);
    await wait(700);
    if (me !== run) return;
    bot.innerHTML = `<span class="quote">${s.name}</span>🔍 Scanning <b>${s.name}</b>…<span class="msg__time">${clock()}</span>`;
    await wait(1100);

    for (let i = 0; i < s.steps.length; i++) {
      if (me !== run) return;
      if (i > 0) await wait(2200); // the real wait is 1–3 minutes
      if (me !== run) return;
      bot.innerHTML = `<span class="quote">${s.name}</span>${s.steps[i](s.name)}<span class="msg__time">edited ${clock()}</span>`;
      chat.scrollTop = chat.scrollHeight;
    }
  }

  picker.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-sample]");
    if (b) play(b.dataset.sample);
  });

  // One orchestrated moment on load: the bot catches the test file.
  play("eicar");
})();
