export default function createSortComparator(sortCriteria) {
  return function compareObjects(jobA, jobB) {
    let i = 0;
    while (
      i < sortCriteria.length - 1 &&
      jobA[sortCriteria[i]] === jobB[sortCriteria[i]]
    ) {
      i++;
    }
    if (i >= sortCriteria.length) {
      i = sortCriteria.length - 1;
    }
    const key = sortCriteria[i];
    const a = jobA[key];
    const b = jobB[key];
    if (typeof a === "number" && typeof b === "number") {
      return a - b;
    }
    return String(b).localeCompare(String(a));
  };
}
