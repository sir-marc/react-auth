import mapArrayToObj from "../src/utils/mapArrayToObj";

test("should return an object with array entries as keys", () => {
  const array = ['a', 'b', 'c'];
  const obj = mapArrayToObj(array);
  const expected = {
    'a': true,
    'b': true,
    'c': true,
  }
  expect(obj).toEqual(expected);
});

test('should return an empty object when an empty array is passed', () => {
  const array = [];
  const obj = mapArrayToObj(array);
  const expected = {}
  expect(obj).toEqual(expected);
});
