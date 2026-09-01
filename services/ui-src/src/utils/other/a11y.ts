// used to find the first header element on the page, if h1 doesn't load immediately, find main
export const findPageH1 = () => {
  const target =
    document.querySelector("h1") ?? document.querySelector("#main-content");
  return target;
};

export const focusHeading = () => {
  const target = findPageH1();
  target?.setAttribute("tabindex", "-1");
  target?.focus();
  window.scrollTo(0, 0);
};
