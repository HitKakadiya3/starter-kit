import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { withPromoParams } from "./promoUrl";

function navigateTo(url: string): void {
  window.history.pushState({}, "", url);
}

describe("withPromoParams", () => {
  beforeEach(() => {
    navigateTo("/");
  });

  afterEach(() => {
    navigateTo("/");
  });

  it("returns the url unchanged when no promo params are present", () => {
    navigateTo("/");
    expect(withPromoParams("/instructions")).toBe("/instructions");
    expect(withPromoParams("/checkout?qid=42")).toBe("/checkout?qid=42");
  });

  it("appends mdid when it's in the current URL and the target has no query string", () => {
    navigateTo("/?mdid=50");
    expect(withPromoParams("/instructions")).toBe("/instructions?mdid=50");
  });

  it("appends prc_id when it's in the current URL and the target has no query string", () => {
    navigateTo("/?prc_id=ABC");
    expect(withPromoParams("/instructions")).toBe("/instructions?prc_id=ABC");
  });

  it("uses `&` separator when the target already has a query string", () => {
    navigateTo("/?mdid=50");
    expect(withPromoParams("/checkout?qid=42")).toBe(
      "/checkout?qid=42&mdid=50",
    );
  });

  it("forwards both prc_id and mdid when both are set on the current URL", () => {
    navigateTo("/?prc_id=ABC&mdid=50");
    expect(withPromoParams("/checkout?qid=42")).toBe(
      "/checkout?qid=42&prc_id=ABC&mdid=50",
    );
  });

  it("URI-encodes param values", () => {
    navigateTo("/?mdid=" + encodeURIComponent("50 off"));
    expect(withPromoParams("/instructions")).toBe(
      "/instructions?mdid=50%20off",
    );
  });
});
