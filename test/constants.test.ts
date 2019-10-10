import {
  anyCharacter,
  anything,
  digit,
  endOfLine,
  something,
  startOfLine,
  whitespaceCharacter,
  wordBoundary,
  wordCharacter
} from "../src/constants";
import RawExpression from "../src/types/raw-expression";
import VerEx from "../src/verex";

describe("startOfLine", () => {
  it("should anchor matches to the start of the line", () => {
    expect(VerEx(startOfLine, "foo").test("foobar")).toBeTruthy();
    expect(VerEx(startOfLine, "bar").test("foobar")).toBeFalsy();
  });

  it("should not allow matches when not the first argument to VerEx", () => {
    expect(VerEx("foo", startOfLine).test("foobar")).toBeFalsy();
  });
});

describe("endOfLine", () => {
  it("should anchor matches to the end of the line", () => {
    expect(VerEx("bar", endOfLine).test("foobar")).toBeTruthy();
    expect(VerEx("foo", endOfLine).test("foobar")).toBeFalsy();
  });

  it("should not allow matches when not the last arg to VerEx", () => {
    expect(VerEx(endOfLine, "bar").test("foobar")).toBeFalsy();
  });
});

describe("digit", () => {
  const aDigit = VerEx(/^/, digit, /$/);

  it("should match arabic numeral characters", () => {
    expect(aDigit.test("0")).toBeTruthy();
    expect(aDigit.test("2")).toBeTruthy();
    expect(aDigit.test("8")).toBeTruthy();
  });

  it("should not match non-digit and digit-like characters", () => {
    expect(aDigit.test("a")).toBeFalsy();
    expect(aDigit.test("₉")).toBeFalsy();
    expect(aDigit.test("❾")).toBeFalsy();
    expect(aDigit.test("１")).toBeFalsy();
    expect(aDigit.test("2️⃣")).toBeFalsy();
    expect(aDigit.test("١")).toBeFalsy();
    expect(aDigit.test("१")).toBeFalsy();
    expect(aDigit.test("೧")).toBeFalsy();
    expect(aDigit.test("๑")).toBeFalsy();
  });
});

describe("wordCharacter", () => {
  const wordCharacters = VerEx(/^/, wordCharacter, new RawExpression("+"), /$/);

  it("should match a–z and A–Z", () => {
    expect(wordCharacters.test("abcdefghijklmnopqrstuvwxyz")).toBeTruthy();
    expect(wordCharacters.test("ABCDEFGHIJKLMNOPQRSTUVWXYZ")).toBeTruthy();
  });

  it("should match arabic numerals", () => {
    expect(wordCharacters.test("0123456789")).toBeTruthy();
  });

  it("should match an underscore", () => {
    expect(wordCharacters.test("_")).toBeTruthy();
  });

  it("should not match non-word characters", () => {
    expect(wordCharacters.test("-")).toBeFalsy();
    expect(wordCharacters.test("é")).toBeFalsy();
    expect(wordCharacters.test("%")).toBeFalsy();
    expect(wordCharacters.test("ℳ")).toBeFalsy();
    expect(wordCharacters.test("µ")).toBeFalsy();
    expect(wordCharacters.test("👍")).toBeFalsy();
  });
});

describe("whitespaceCharacter", () => {
  const whitespaceCharacters = VerEx(/^/, whitespaceCharacter, /$/);

  it("should match whitespace characters", () => {
    const whitespaces = [" ", "\f", "\n", "\r", "\t", "\v", "\u00a0", "\u1680", "\u2000", "\u2001", "\u2002", "\u2002", "\u2003", "\u2004", "\u2005", "\u2006", "\u2007", "\u2008", "\u2009", "\u200a", "\u2028", "\u2029", "\u202f", "\u205f", "\u3000", "\ufeff"];

    for (const whitespace of whitespaces) {
      expect(whitespaceCharacters.test(whitespace)).toBeTruthy();
    }

    expect(whitespaceCharacters.test("a")).toBeFalsy();
    expect(whitespaceCharacters.test("1")).toBeFalsy();
    expect(whitespaceCharacters.test("-")).toBeFalsy();
  });
});

describe("wordBoundary", () => {
  const expression = VerEx(wordBoundary, "foo", wordBoundary);

  it("should anchor matches to word boundaries", () => {
    expect(expression.test("bar foo baz?")).toBeTruthy();
    expect(expression.test("baz-foo-bar")).toBeTruthy();
    expect(expression.test("foo")).toBeTruthy();

    expect(expression.test("foobar?")).toBeFalsy();
    expect(expression.test("baz foo_ bar")).toBeFalsy();
    expect(expression.test("foo33")).toBeFalsy();
  });
});

describe("anyCharacter", () => {
  it("should match any character", () => {
    const expression = VerEx(anyCharacter);

    expect(expression.test("a")).toBeTruthy();
    expect(expression.test("1")).toBeTruthy();
    expect(expression.test("%")).toBeTruthy();
    expect(expression.test("ℳ")).toBeTruthy();
    expect(expression.test("µ")).toBeTruthy();
    expect(expression.test("👍")).toBeTruthy();
  });

  it("should not match the newline character", () => {
    expect(VerEx(anyCharacter).test("\n")).toBeFalsy();
  });
});

describe("anything", () => {
  it("should match a non-empty string", () => {
    expect(VerEx(anything).test("foobar")).toBeTruthy();
  });

  it("should match an empty string", () => {
    expect(VerEx(anything).test("")).toBeTruthy();
    expect(VerEx("foo", anything, "bar").test("foobar")).toBeTruthy();
  });

  it("should be usable in conjunction with other arguments", () => {
    expect(VerEx("foo", anything).test("foobar")).toBeTruthy();
    expect(VerEx("foo", anything).test("bar")).toBeFalsy();
  });
});

describe("something", () => {
  it("should match a non-empty string", () => {
    expect(VerEx(something).test("foobar")).toBeTruthy();
  });

  it("should not match an empty string", () => {
    expect(VerEx(something).test("")).toBeFalsy();
    expect(VerEx("foo", something, "bar").test("foobar")).toBeFalsy();
  });

  it("should be usable in conjunction with other arguments", () => {
    expect(VerEx("foo", something).test("foobar")).toBeTruthy();
    expect(VerEx("foo", something).test("bar")).toBeFalsy();
  });
});
