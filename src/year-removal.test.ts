/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { describe, expect, it } from "vitest";

import { removeYearFromMask } from "./year-removal";

describe("year-removal", () => {
  it("removes year for en-US mask", () => {
    expect(removeYearFromMask("M/d/yyyy", "en-US")).toBe("M/d");
  });

  it("preserves trailing dot for dot-preserving locales", () => {
    expect(removeYearFromMask("d.M.yyyy", "de-DE")).toBe("d.M.");
    expect(removeYearFromMask("d.M.yyyy", "fr-CH")).toBe("d.M.");
  });

  it("removes trailing dot for non dot-preserving locales", () => {
    expect(removeYearFromMask("d.M.yyyy", "en-US")).toBe("d.M");
  });

  it("handles long month de-DE mask", () => {
    expect(removeYearFromMask("d. MMMM yyyy", "de-DE")).toBe("d. MMMM");
  });

  it("handles Japanese year marker", () => {
    expect(removeYearFromMask("yyyy年M月d日", "ja-JP")).toBe("M月d日");
  });

  it("handles Korean year marker", () => {
    expect(removeYearFromMask("yyyy년 M월 d일", "ko-KR")).toBe("M월 d일");
  });

  it("handles Russian year suffix", () => {
    expect(removeYearFromMask("d MMMM yyyy 'г.'", "ru-RU")).toBe("d MMMM");
  });

  it("handles Ukrainian year suffix", () => {
    expect(removeYearFromMask("d MMMM yyyy 'р.'", "uk-UA")).toBe("d MMMM");
  });

  it("handles Latvian gada suffix", () => {
    expect(removeYearFromMask("yyyy. 'gada' d. MMMM", "lv-LV")).toBe("d. MMMM");
  });

  it("handles Lithuanian m token", () => {
    expect(removeYearFromMask("M/d/yyyy 'm'", "lt-LT")).toBe("M/d");
  });

  it("handles Basque ('e')'ko' pattern", () => {
    expect(removeYearFromMask("yyyy('e')'ko' M/d", "eu-ES")).toBe("M/d");
  });

  it("handles Spanish de-construction", () => {
    expect(removeYearFromMask("d 'de' MMMM 'de' yyyy", "es-ES")).toBe("d 'de' MMMM");
  });

  it("normalizes locale codes with underscores and case", () => {
    expect(removeYearFromMask("d.M.yyyy", "FR_CH")).toBe("d.M.");
  });
});
