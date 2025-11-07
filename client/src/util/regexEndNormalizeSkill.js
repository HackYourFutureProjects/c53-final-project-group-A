/**
 * Prepare a skill string for reliable matching and comparison.
 *
 * Purpose:
 * - Escape any regular-expression metacharacters in the provided skill so it can be
 *   safely used inside a RegExp.
 * - Build a case-insensitive RegExp that matches the skill when it appears as a
 *   separate token surrounded by spaces (e.g. " react " will match the token "react").
 * - Produce a normalized version of the skill where hyphens, slashes and whitespace
 *   are replaced with single spaces to help with text comparisons.
 *
 * Parameters:
 * @param {string} skill - The raw skill text to escape and normalize.
 *
 * Returns:
 * @returns {{ skill: string, skillRegex: RegExp, normalizedSkill: string }}
 * - skill: the original input string.
 * - skillRegex: a case-insensitive RegExp that matches the skill as a standalone token
 *   (note: the regex built here uses surrounding spaces when matching).
 * - normalizedSkill: the input with hyphens, slashes and whitespace collapsed to single
 *   spaces (useful for normalization and comparisons).
 */
export function regexEndNormalizeSkill(skill) {
  let normalizedSkill = skill;
  normalizedSkill = normalizedSkill
    .toLowerCase()
    .replace(/[-/\s]/g, " ")
    .replace(/ +/g, " ");
  let escaped = normalizedSkill;
  escaped = escaped.replace(/[.*+?^${}()|[\]\\#]/g, "\\$&");
  const skillRegex = new RegExp(" " + escaped + " ", "i");
  return { skill, skillRegex, normalizedSkill };
}
