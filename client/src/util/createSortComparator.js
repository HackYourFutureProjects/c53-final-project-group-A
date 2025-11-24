export default function createSortComparator(sortCriteria) {
  return function compareObjects(aa, bb) {
    let i = 0;
    while (
      i < sortCriteria.length - 1 &&
      aa[sortCriteria[i]] === bb[sortCriteria[i]]
    ) {
      i++;
    }
    if (i >= sortCriteria.length) {
      i = sortCriteria.length - 1;
    }
    const key = sortCriteria[i];
    const a = aa[key];
    const b = bb[key];
    if (typeof a === "number" && typeof b === "number") {
      return a - b;
    }
    return String(b).localeCompare(String(a));
  };
}
