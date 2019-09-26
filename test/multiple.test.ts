import multiple from "../src/multiple";
import VerEx from "../src/verbalexpressions";

describe("multiple(arg)", () => {
  it("should be a function", () => {
    expect(multiple).toBeInstanceOf(Function);
  });

  it("should match zero repetitions", () => {
    const exp = VerEx(/^/, multiple("foo"), /$/);
    expect(exp.test("")).toBeTruthy();
  });

  it("should match * number of repetitions", () => {
    const exp = VerEx(/^/, multiple("foo"), /$/);
    for (let i = 0; i < 20; i++) {
      expect(exp.test("foo".repeat(i))).toBeTruthy();
    }
  });
});
