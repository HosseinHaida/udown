export function getCourtNames(state) {
  let array = state.list.map(o => o.name);
  return array;
}
