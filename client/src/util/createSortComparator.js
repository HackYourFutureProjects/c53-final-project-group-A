/**
 * createSortComparator
 *
 * Returns a comparator function suitable for `Array.prototype.sort` that
 * applies multiple criteria in the order provided by `selectedSort`.
 *
 * Behavior notes:
 * - The comparator walks the list of selected sort keys and compares the
 *   corresponding fields on the two job objects until it finds a difference;
 *   that difference determines the ordering.
 * - For numeric values the comparator currently returns `a - b` which produces
 *   ascending order (smallest values first).
 * - For non-numeric values the comparator uses `String(b).localeCompare(String(a))`
 *   which produces descending order (largest / newest first).
 * - This means numeric fields (e.g. `travel_time`, `least_transfers`) are
 *   sorted ascending (e.g. "Nearest first" => smallest travel time first),
 *   while string-like fields are sorted descending.
 * - If `selectedSort` is empty or maps to no valid fields, the returned
 *   comparator is a no-op (always returns 0) and leaves the array order
 *   unchanged.
 * - If all selected criteria are equal for two items the comparator returns 0.
 *
 * @param {string[]|undefined} selectedSort - array of user-visible sort labels
 * @returns {(a: object, b: object) => number} comparator for `Array.prototype.sort`
 */
export default function createSortComparator(selectedSort) {
  const renaming = {
    "Most skill matches": "skillsMatch",
    "Fewest transport transfers": "least_transfers",
    "Nearest first": "travel_time",
    "Newest first": "date_posted",
  };
  selectedSort = (selectedSort || [])
    .map((criterion) => renaming[criterion])
    .filter((criterion) => criterion !== undefined);
  if (selectedSort.length === 0) {
    return () => 0;
  }
  return function compareObjects(jobA, jobB) {
    let i = 0;
    while (
      i < selectedSort.length &&
      jobA[selectedSort[i]] === jobB[selectedSort[i]]
    ) {
      i++;
    }
    if (i >= selectedSort.length) {
      return 0;
    }
    const key = selectedSort[i];
    const a = jobA[key];
    const b = jobB[key];
    if (typeof a === "number" && typeof b === "number") {
      return a - b;
    }
    return String(b).localeCompare(String(a));
  };
}
