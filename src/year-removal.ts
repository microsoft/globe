/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// Match optional separators around a year token but preserve dots used by dot-separated locales.
const NO_YEAR_PREFIX = "(?:[\\/\\-,]\\s?|\\s'de'\\s|'\\sde\\s')*";
// Same as NO_YEAR_PREFIX, but allows removing a leading dot for locales that do not preserve dot-after-month.
const NO_YEAR_PREFIX_REMOVE_DOT_AFTER_MONTH = "(?:[\\.\\/\\-,]\\s?|\\s'de'\\s|'\\sde\\s')*";
// Match year tokens and locale-specific year affixes (e.g. 年, 년, г., р., gada, 'm', ('e')'ko').
const NO_YEAR_SEGMENT = "(?:y|'m'|(?:\\('e'\\)'ko')|(?:'?(?:年|년|г\\.?|\\s?р\\.?|gada)'?))+";
const NO_YEAR_SUFFIX = "[\\.\\/\\-]*";

const NO_YEAR_REGEX = new RegExp(`${NO_YEAR_PREFIX}${NO_YEAR_SEGMENT}${NO_YEAR_SUFFIX}`, "g");
const NO_YEAR_REGEX_REMOVE_DOT_AFTER_MONTH = new RegExp(
  `${NO_YEAR_PREFIX_REMOVE_DOT_AFTER_MONTH}${NO_YEAR_SEGMENT}${NO_YEAR_SUFFIX}`,
  "g"
);

// Locale language codes that require preserving the dot separator after month/day when removing year.
const localesRequiringDotAfterMonth = new Set<string>([
  "bs",
  "cs",
  "de",
  "dsb",
  "fi",
  "gsw",
  "hr",
  "hsb",
  "hu",
  "is",
  "ko",
  "lb",
  "lv",
  "nb",
  "nds",
  "nn",
  "sk",
  "sl",
  "sr",
]);

// Full locale codes that require preserving the dot separator.
const localesWithCountryCodeRequiringDotAfterMonth = new Set<string>(["fr-ch"]);

function getLocaleCodeWithoutCountrySuffix(localeCode: string): string {
  return localeCode.split("-")[0];
}

function normalizeLocaleCode(localeCode: string): string {
  return localeCode.toLowerCase().replace(/_/g, "-");
}

function doesLocaleRequireDotAfterMonth(localeCode: string): boolean {
  const normalizedLocaleCode = normalizeLocaleCode(localeCode);
  const localeCodeWithoutCountrySuffix = getLocaleCodeWithoutCountrySuffix(normalizedLocaleCode);
  return (
    localesWithCountryCodeRequiringDotAfterMonth.has(normalizedLocaleCode) ||
    localesRequiringDotAfterMonth.has(localeCodeWithoutCountrySuffix)
  );
}

function normalizeMaskWhitespace(mask: string): string {
  return mask.replace(/\s+/g, " ").trim();
}

export function removeYearFromMask(mask: string, localeCode: string): string {
  // Locales requiring dot-after-month use a regex variant that does not strip leading dots.
  const regex = doesLocaleRequireDotAfterMonth(localeCode)
    ? NO_YEAR_REGEX
    : NO_YEAR_REGEX_REMOVE_DOT_AFTER_MONTH;
  return normalizeMaskWhitespace(mask.replace(regex, ""));
}
