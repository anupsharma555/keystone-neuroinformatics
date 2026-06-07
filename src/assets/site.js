function fallbackCopy(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var copied = document.execCommand("copy");
    document.body.removeChild(textArea);
    return copied;
  } catch (error) {
    document.body.removeChild(textArea);
    return false;
  }
}

function updateCopyButton(button, label, duration) {
  var original = button.dataset.originalLabel || button.textContent;
  button.dataset.originalLabel = original;
  button.textContent = label;

  if (label === "Copied") {
    button.classList.add("copied");
  }

  window.setTimeout(function() {
    button.textContent = original;
    button.classList.remove("copied");
  }, duration);
}

function buildField(label, value) {
  return label + ":\n" + (value || "") + "\n";
}

document.addEventListener("DOMContentLoaded", function() {
  var navToggle = document.querySelector(".nav-toggle");
  var navMenu = document.querySelector(".nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function() {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navMenu.classList.toggle("is-open", !expanded);
    });
  }

  var copyButtons = document.querySelectorAll(".copy-email-btn");

  copyButtons.forEach(function(button) {
    button.addEventListener("click", function() {
      var email = button.getAttribute("data-email");

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function() {
          updateCopyButton(button, "Copied", 1500);
        }).catch(function() {
          if (fallbackCopy(email)) {
            updateCopyButton(button, "Copied", 1500);
            return;
          }

          updateCopyButton(button, "Copy failed", 2000);
        });

        return;
      }

      if (fallbackCopy(email)) {
        updateCopyButton(button, "Copied", 1500);
        return;
      }

      updateCopyButton(button, "Copy failed", 2000);
    });
  });

  var intakeDialog = document.getElementById("intake-dialog");
  var intakeForm = document.getElementById("intake-form");
  var intakeTitle = document.getElementById("intake-title");
  var intakeEyebrow = document.getElementById("intake-eyebrow");
  var intakeNote = document.getElementById("intake-note");
  var openButtons = document.querySelectorAll(".js-intake-open");
  var closeButton = intakeDialog ? intakeDialog.querySelector("[data-intake-close]") : null;
  var emailSubmit = document.getElementById("intake-email-submit");
  var copySubmit = document.getElementById("intake-copy-submit");
  var activeIntakeEmail = "";

  function setIntakeEmail(email) {
    activeIntakeEmail = email;

    intakeEyebrow.textContent = "Collaboration intake";
    intakeTitle.textContent = "Start a collaboration request";
    intakeNote.textContent = "This form prepares a structured collaboration request that can be emailed or copied.";
  }

  function collectIntakeBody() {
    var formData = new FormData(intakeForm);
    var body = "";

    body += buildField("Organization or lab", formData.get("organization"));
    body += "\n";
    body += buildField("Project or program", formData.get("project"));
    body += "\n";
    body += buildField("Specific aims or core questions", formData.get("aims"));
    body += "\n";
    body += buildField("Data types or systems involved", formData.get("data"));
    body += "\n";
    body += buildField("Requested support", formData.get("support"));
    body += "\n";
    body += buildField("Timeline or constraints", formData.get("timeline"));
    body += "\n";
    body += buildField("Email address", formData.get("email"));
    return body;
  }

  if (intakeDialog && intakeForm && intakeTitle && intakeEyebrow && intakeNote) {
    openButtons.forEach(function(button) {
      button.addEventListener("click", function() {
        setIntakeEmail(button.dataset.intakeEmail);
        intakeForm.reset();
        intakeDialog.showModal();
      });
    });

    if (closeButton) {
      closeButton.addEventListener("click", function() {
        intakeDialog.close();
      });
    }

    intakeDialog.addEventListener("click", function(event) {
      if (event.target === intakeDialog) {
        intakeDialog.close();
      }
    });

    emailSubmit.addEventListener("click", function() {
      var subject = "Collaboration Inquiry";
      var body = collectIntakeBody();
      window.location.href = "mailto:" + activeIntakeEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });

    copySubmit.addEventListener("click", function() {
      var body = collectIntakeBody();

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(body).then(function() {
          intakeNote.textContent = "Request text copied to clipboard.";
        }).catch(function() {
          if (fallbackCopy(body)) {
            intakeNote.textContent = "Request text copied to clipboard.";
            return;
          }

          intakeNote.textContent = "Copy failed. Please use the email option.";
        });
        return;
      }

      if (fallbackCopy(body)) {
        intakeNote.textContent = "Request text copied to clipboard.";
        return;
      }

      intakeNote.textContent = "Copy failed. Please use the email option.";
    });

    setIntakeEmail("");
  }
});
