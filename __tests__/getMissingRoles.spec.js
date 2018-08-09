import getMissingRoles from "../src/utils/getMissingRoles";

test("getMissingRoles should return the missing roles", () => {
  const roles = { user: true };
  const neededRoles = ["user", "admin"];
  const missingRoles = getMissingRoles(neededRoles, roles);
  expect(missingRoles).toHaveLength(1);
  expect(missingRoles[0]).toEqual("admin");
});

test("getMissingRoles should return an empty array if each role is present", () => {
  const roles = { user: true, admin: true };
  const neededRoles = ["user", "admin"];
  const missingRoles = getMissingRoles(neededRoles, roles);
  expect(missingRoles).toHaveLength(0);
});

test("getMissingRoles should return an empty array if no role is needed", () => {
  const roles = { user: true, admin: true };
  const neededRoles = [];
  const missingRoles = getMissingRoles(neededRoles, roles);
  expect(missingRoles).toHaveLength(0);
});
