addEventListener("load", function stumbleenh_load() {
  "use strict";

  function overlay() {
    if ("StumbleGlobals" in window && !window.StumbleGlobals.handle_window_load) {
      setTimeout(overlay, 1000);
      return;
    }

    let prefNumStumbles = Application.prefs.get("extensions.stumbleenh.numstumbles", 20);
    let numStumbles = prefNumStumbles.value;
    prefNumStumbles.events.addListener(
      "change",
      { handleEvent: function(aEvent) {
        numStumbles = prefNumStumbles.value;
      } }
    );

    let prefEnabled = Application.prefs.get("extensions.stumbleenh.enabled");
    let enabled = prefEnabled.value;
    prefEnabled.events.addListener(
      "change",
      { handleEvent: function(aEvent) {
        let enabled = prefEnabled.value;
      } }
    );

    let running = false;

    let stumble = (window.StumbleGlobals.stumble || window.stumble);
    let cancel_throttle = (window.StumbleGlobals.cancel_stumble_throttle || window.su_cancel_stumble_throttle);

    let original;
    let override = function(evt, todo) {
      if (!enabled) {
        return original.apply(null, arguments);
      }
      if (running) {
        return;
      }
      running = true;
      todo = todo || numStumbles;

      let sub = document.getElementById("su_stumble") || document.getElementById("stumbleglobals_stumble");
      sub = sub || {
        setAttribute: function() {}
      };
      let sue = document.getElementById("stumbleenh-button");
      sue = sue || {
        setAttribute: function() {}
      };

      sub.setAttribute("stumbleenh", "true");
      sue.setAttribute("stumbleenh", "true");

      let tt = sub.getAttribute("tooltiptext");
      sub.setAttribute("tooltiptext", todo.toString());
      sue.setAttribute("tooltiptext", todo.toString());
      (function stumblemore() {
        if (!todo) {
          running = false;
          sub.removeAttribute("stumbleenh");
          sue.removeAttribute("stumbleenh");
          sub.setAttribute("tooltiptext", tt);
          sue.removeAttribute("tooltiptext");
          return;
        }
        if (!(window.StumbleGlobals.stumble_async_context || window.su_stumble_async_context)) {
          stumble(true);
          cancel_throttle();
          --todo;
          sue.setAttribute("tooltiptext", todo.toString());
        }
        setTimeout(stumblemore, 500);
      })();
    };
    if ("StumbleGlobals" in window) {
      original = function() StumbleGlobals.clickstumble.apply(StumbleGlobals, arguments);
      StumbleGlobals.clickstumble = override;
    }
    else {
      original = clickstumble;
      clickstumble = override;
    }
    document.getElementById("stumbleenh-button").addEventListener("command", override, true);
  }

  removeEventListener("load", stumbleenh_load, true);
  overlay();
}, true);
