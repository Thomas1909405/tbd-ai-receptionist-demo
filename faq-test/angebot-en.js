(() => {
  "use strict";
  const form = document.querySelector("#demo-form");
  const status = document.querySelector("#form-status");
  const email = window.TBD_SALES_CONFIG?.contactEmail?.trim();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!email) {
      status.textContent = "This page is ready as a local preview. The TBD contact email has not been configured; nothing was sent.";
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    const subject = `Demo request · ${data.campground}`;
    const body = [
      "Hello TBD AI Solutions,",
      "",
      "I’d like to request a no-obligation walkthrough of TBD AI Receptionist.",
      `Campsite: ${data.campground}`,
      `Name: ${data.name}`,
      `Country: ${data.country}`,
      `My email: ${data.email}`,
      `I’d like to see: ${data.interest || "Not specified"}`,
      "",
      "Please contact me to arrange a time."
    ].join("\n");
    status.textContent = "Your email app will open a draft. The message is sent only if you choose to send it there.";
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
