/**
 * Formspree init + 成功提示弹层（由 renderSuccess 接管，避免顶部弱提示）。
 */
(function () {
  function ensureToastUi() {
    let backdrop = document.getElementById("form-success-toast-backdrop");
    let toast = document.getElementById("form-success-toast");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "form-success-toast-backdrop";
      backdrop.className = "form-success-toast-backdrop";
      backdrop.hidden = true;
      document.body.appendChild(backdrop);
    }
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "form-success-toast";
      toast.className = "form-success-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    return { backdrop, toast };
  }

  function hideToast(backdrop, toast) {
    toast.classList.remove("is-visible");
    backdrop.classList.remove("is-visible");
    window.setTimeout(function () {
      backdrop.hidden = true;
      toast.hidden = true;
    }, 220);
  }

  window.initEverwildFormspree = function (opts) {
    window.formspree =
      window.formspree ||
      function () {
        (formspree.q = formspree.q || []).push(arguments);
      };

    formspree("initForm", {
      formElement: opts.formElement,
      formId: opts.formId,
      renderSuccess: function (ctx, message) {
        var text =
          (message && String(message).trim()) || "提交成功，我们会尽快与你联系。";
        var ui = ensureToastUi();
        var backdrop = ui.backdrop;
        var toast = ui.toast;

        toast.textContent = text;
        toast.hidden = false;
        backdrop.hidden = false;
        window.requestAnimationFrame(function () {
          backdrop.classList.add("is-visible");
          toast.classList.add("is-visible");
        });

        if (ctx.form && typeof ctx.form.reset === "function") {
          ctx.form.reset();
        }

        clearTimeout(toast._everwildHideTimer);
        toast._everwildHideTimer = window.setTimeout(function () {
          hideToast(backdrop, toast);
        }, 2000);
      }
    });
  };
})();
