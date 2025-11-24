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
