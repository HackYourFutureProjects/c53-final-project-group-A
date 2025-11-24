export default function createSortComparator(selectedSort) {
  return function compareObjects(jobA, jobB) {
    let i = 0;
    while (
      i < selectedSort.length - 1 &&
      jobA[selectedSort[i]] === jobB[selectedSort[i]]
    ) {
      i++;
    }
    if (i >= selectedSort.length) {
      i = selectedSort.length - 1;
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
