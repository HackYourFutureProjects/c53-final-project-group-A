export default function createSortComparator(sortCriteria) {
  return function compareObjects(aa, bb) {
    let k = 0;
    while (
      k < sortCriteria.length - 1 &&
      aa[sortCriteria[k]] === bb[sortCriteria[k]]
    ) {
      k++;
    }
    if (k >= sortCriteria.length) {
      k = sortCriteria.length - 1;
    }
    const key = sortCriteria[k];
    const a = aa[key];
    const b = bb[key];
    if (typeof a === "number" && typeof b === "number") {
      return a - b;
    }
    return String(b).localeCompare(String(a));
  };
}
