import { useCallback } from "react";

const DEFAULT_SCOPE_SELECTOR = "[data-enter-scope='true']";
const DEFAULT_FOCUS_SELECTOR = "input, select, textarea, button";

export const useEnterToAdvance = (options = {}) => {
  const scopeSelector = options.scopeSelector || DEFAULT_SCOPE_SELECTOR;
  const focusSelector = options.focusSelector || DEFAULT_FOCUS_SELECTOR;

  return useCallback(
    (event) => {
      if (event.key !== "Enter") return;
      if (event.isComposing) return;
      const scope = event.currentTarget.closest(scopeSelector);
      if (!scope) return;
      const focusable = Array.from(scope.querySelectorAll(focusSelector)).filter(
        (el) => !el.disabled && el.type !== "hidden"
      );
      const index = focusable.indexOf(event.currentTarget);
      if (index >= 0 && index < focusable.length - 1) {
        event.preventDefault();
        focusable[index + 1].focus();
      }
    },
    [focusSelector, scopeSelector]
  );
};
