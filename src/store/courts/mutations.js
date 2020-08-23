export function findCourtIdByCourtName(state, name) {
  let desiredCourtObj = state.list.find(o => o.name === name);
  return desiredCourtObj.id;
}
