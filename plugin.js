// Adds working replacements for the core-locked status-bar menu rows.
// The SDK has no supported contribution point inside this core context menu,
// so this plugin replaces only those disabled DOM rows while the menu is open.

const ID = "b2766cf5-7927-43c7-9453-f499fe3370b5";
const HIDDEN_ATTRIBUTE = "data-status-bar-visibility-hidden";
const CORE_ROW_ATTRIBUTE = "data-status-bar-visibility-core-row";
const CUSTOM_ROW_ATTRIBUTE = "data-status-bar-visibility-row";
const STORAGE_KEY = "visibility-v2";

const ITEMS = [
  { key: "commandCenter", label: "Command Center" },
  { key: "clientVersion", label: "Version & updates" },
  { key: "backendVersion", label: "Backend version" },
];
const DEFAULT_HIDDEN = Object.freeze({
  commandCenter: true,
  clientVersion: true,
  backendVersion: true,
});

function normalizeVisibility(value) {
  const visibility = { ...DEFAULT_HIDDEN };
  if (!value || typeof value !== "object" || Array.isArray(value))
    return visibility;

  for (const { key } of ITEMS) {
    if (typeof value[key] === "boolean") visibility[key] = value[key];
  }
  return visibility;
}

function versionKey(control) {
  const text = (control.innerText || control.textContent || "").trim();
  if (/(?:クライアント|client)\s+v?\d/i.test(text)) return "clientVersion";
  if (/(?:バックエンド|backend)\s+v?\d/i.test(text)) return "backendVersion";
  return null;
}

function show(control) {
  control.removeAttribute(HIDDEN_ATTRIBUTE);
  control.style.removeProperty("display");
}

function hide(control) {
  control.setAttribute(HIDDEN_ATTRIBUTE, "");
  control.style.setProperty("display", "none", "important");
}

function applyVisibility(visibility) {
  document.querySelectorAll(`[${HIDDEN_ATTRIBUTE}]`).forEach(show);

  for (const footer of document.querySelectorAll("footer")) {
    const controls = Array.from(footer.querySelectorAll("button, a"));
    if (!controls.some(versionKey)) continue;

    const leftCluster = controls
      .filter((control) => control.getClientRects().length > 0)
      .sort(
        (a, b) =>
          a.getBoundingClientRect().left - b.getBoundingClientRect().left,
      );
    // Command Center is the first button. The connected-Gateway switcher has a
    // min-width wrapper, so hide that wrapper rather than its inner button;
    // hiding only the button leaves an empty strip in the footer. Gateway
    // health is separate and remains under Hermes' built-in "Gateway" row.
    if (visibility.commandCenter) {
      if (leftCluster[0]) hide(leftCluster[0]);
      const gatewaySwitcher = footer.querySelector(
        '[data-slot="connection-switcher"]',
      );
      if (gatewaySwitcher) hide(gatewaySwitcher);
    }

    for (const control of controls) {
      const key = versionKey(control);
      if (key && visibility[key]) hide(control);
    }
  }
}

function rowLabel(row) {
  return (row.innerText || row.textContent || "").trim();
}

function updateCustomRow(row, hidden) {
  row.setAttribute("aria-checked", String(!hidden));
  row.setAttribute("data-state", hidden ? "unchecked" : "checked");
  const indicator = row.querySelector("[data-statusbar-visibility-indicator]");
  const mark = hidden ? "" : "✓";
  // Reassigning textContent creates a child-list mutation even when unchanged.
  // Keep this idempotent so future menu-refresh hooks cannot form a render loop.
  if (indicator && indicator.textContent !== mark) indicator.textContent = mark;
}

function createCustomRow(template, item, visibility, setVisibility) {
  const row = document.createElement("div");
  row.className = template.className;
  row.setAttribute("role", "menuitemcheckbox");
  row.setAttribute("tabindex", "0");
  row.setAttribute(CUSTOM_ROW_ATTRIBUTE, item.key);
  row.style.setProperty("pointer-events", "auto", "important");

  const label = document.createElement("span");
  label.className =
    template.querySelector(".truncate")?.className || "truncate";
  label.textContent = item.label;

  const indicator = document.createElement("span");
  indicator.setAttribute("aria-hidden", "true");
  indicator.setAttribute("data-statusbar-visibility-indicator", "");
  indicator.style.marginLeft = "auto";
  indicator.style.minWidth = "1rem";
  indicator.style.textAlign = "center";
  row.append(label, indicator);

  const toggle = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setVisibility(item.key);
  };
  row.addEventListener("click", toggle);
  row.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") toggle(event);
  });
  row.addEventListener("mouseenter", () =>
    row.setAttribute("data-highlighted", ""),
  );
  row.addEventListener("mouseleave", () =>
    row.removeAttribute("data-highlighted"),
  );
  updateCustomRow(row, visibility[item.key]);
  return row;
}

function patchMenus(visibility, setVisibility) {
  for (const menu of document.querySelectorAll('[role="menu"]')) {
    const coreRows = Array.from(
      menu.querySelectorAll(
        `[role="menuitemcheckbox"]:not([${CUSTOM_ROW_ATTRIBUTE}])`,
      ),
    );
    const template = coreRows.find((row) => !row.hasAttribute("data-disabled"));
    if (!template) continue;

    for (const item of ITEMS) {
      const coreRow = coreRows.find((row) => rowLabel(row) === item.label);
      if (!coreRow) continue;

      coreRow.setAttribute(CORE_ROW_ATTRIBUTE, "");
      coreRow.style.setProperty("display", "none", "important");

      let customRow = menu.querySelector(
        `[${CUSTOM_ROW_ATTRIBUTE}="${item.key}"]`,
      );
      if (!customRow) {
        customRow = createCustomRow(template, item, visibility, setVisibility);
        coreRow.before(customRow);
      } else {
        updateCustomRow(customRow, visibility[item.key]);
      }
    }
  }
}

export default {
  id: ID,
  name: "Status Bar Visibility",
  defaultEnabled: false,
  register(ctx) {
    const localStorageKey = `${ID}:${STORAGE_KEY}`;
    let visibility = { ...DEFAULT_HIDDEN };
    try {
      visibility = normalizeVisibility(
        JSON.parse(window.localStorage.getItem(localStorageKey) || "null"),
      );
    } catch {
      // Invalid old data falls back to the default hidden state.
    }

    const render = () => {
      applyVisibility(visibility);
      patchMenus(visibility, setVisibility);
    };
    const setVisibility = (key) => {
      visibility = { ...visibility, [key]: !visibility[key] };
      try {
        window.localStorage.setItem(
          localStorageKey,
          JSON.stringify(visibility),
        );
      } catch {
        // Current-window toggling still works if persistence is unavailable.
      }
      render();
    };

    // Patch only after the native context menu has mounted. Do not watch the
    // entire document: this plugin itself adds menu children, and a global
    // child-list observer can recursively schedule renderer work.
    const scheduleRender = () => {
      window.setTimeout(render, 0);
      window.setTimeout(render, 32);
    };
    document.addEventListener("contextmenu", scheduleRender, true);

    render();

    ctx.onDispose(() => {
      document.removeEventListener("contextmenu", scheduleRender, true);
      document.querySelectorAll(`[${HIDDEN_ATTRIBUTE}]`).forEach(show);
      document.querySelectorAll(`[${CORE_ROW_ATTRIBUTE}]`).forEach((row) => {
        row.removeAttribute(CORE_ROW_ATTRIBUTE);
        row.style.removeProperty("display");
      });
      document
        .querySelectorAll(`[${CUSTOM_ROW_ATTRIBUTE}]`)
        .forEach((row) => row.remove());
    });
  },
};
