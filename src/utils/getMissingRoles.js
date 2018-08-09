const getMissingRoles = (shouldHave, has) =>
  shouldHave.filter(should => !has.hasOwnProperty(should));
export default getMissingRoles;
