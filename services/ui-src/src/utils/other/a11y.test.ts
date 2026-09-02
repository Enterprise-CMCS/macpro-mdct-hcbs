import { beforeEach, describe, expect, it, vi } from "vitest";
import { focusHeading } from "./a11y";

describe("a11y util test", () => {
  describe("test focusHeading", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
      window.scrollTo = vi.fn();
    });

    it("should do nothing with focus when no h1 or main", () => {
      focusHeading();

      // body is the default activeElement when focus hasn't been moved yet
      expect(document.activeElement).toBe(document.body);
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it("should move focus to main when no h1 exists", () => {
      document.body.innerHTML = `<main id="main-content">Main<h2>Wrong heading</h2></main>`;
      const main = document.querySelector("#main-content") as HTMLElement;
      const focusSpy = vi.spyOn(main, "focus");

      focusHeading();

      expect(main.getAttribute("tabindex")).toBe("-1");
      expect(focusSpy).toHaveBeenCalled();
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
      expect(document.activeElement).toBe(main);
    });

    it("should move focus to h1", () => {
      document.body.innerHTML = `<main id="main-content"><h1>Heading 1</h1></main>`;
      const h1 = document.querySelector("h1") as HTMLElement;
      const focusSpy = vi.spyOn(h1, "focus");

      focusHeading();

      expect(h1.getAttribute("tabindex")).toBe("-1");
      expect(focusSpy).toHaveBeenCalled();
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
      expect(document.activeElement).toBe(h1);
    });
  });
});
