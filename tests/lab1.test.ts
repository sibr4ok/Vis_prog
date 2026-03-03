import { describe, it, expect } from "vitest";
import {
  createUser,
  createBook,
  calculateArea,
  getStatusColor,
  capitalizeFirst,
  trimAndFormat,
  getFirstElement,
  findById
} from "../src/lab1";

describe("createUser", () => {
  it("creates user with default isActive = true", () => {
    const user = createUser(1, "Alice");
    expect(user).toEqual({
      id: 1,
      name: "Alice",
      email: undefined,
      isActive: true
    });
  });

  it("creates user with all fields", () => {
    const user = createUser(2, "Bob", "bob@mail.com", false);
    expect(user.isActive).toBe(false);
    expect(user.email).toBe("bob@mail.com");
  });
});

describe("createBook", () => {
  it("creates fiction book", () => {
    const book = createBook({
      title: "1984",
      author: "George Orwell",
      year: 1949,
      genre: "fiction"
    });
    expect(book.genre).toBe("fiction");
  });

  it("creates non-fiction book without year", () => {
    const book = createBook({
      title: "Sapiens",
      author: "Harari",
      genre: "non-fiction"
    });
    expect(book.year).toBeUndefined();
  });
});

describe("calculateArea", () => {
  it("calculates circle area", () => {
    const result = calculateArea("circle", 2);
    expect(result).toBeCloseTo(Math.PI * 4);
  });

  it("calculates square area", () => {
    expect(calculateArea("square", 4)).toBe(16);
  });
});

describe("getStatusColor", () => {
  it("returns correct colors", () => {
    expect(getStatusColor("active")).toBe("green");
    expect(getStatusColor("inactive")).toBe("gray");
    expect(getStatusColor("new")).toBe("blue");
  });
});

describe("StringFormatter", () => {
  it("capitalizeFirst works", () => {
    expect(capitalizeFirst("hello")).toBe("Hello");
  });

  it("capitalizeFirst uppercase", () => {
    expect(capitalizeFirst("hello", true)).toBe("HELLO");
  });

  it("trimAndFormat works", () => {
    expect(trimAndFormat("  test  ")).toBe("test");
  });

  it("trimAndFormat uppercase", () => {
    expect(trimAndFormat("  test  ", true)).toBe("TEST");
  });
});

describe("getFirstElement", () => {
  it("returns first element", () => {
    expect(getFirstElement([1, 2, 3])).toBe(1);
  });

  it("returns undefined for empty array", () => {
    expect(getFirstElement([])).toBeUndefined();
  });
});

describe("findById", () => {
  const items = [
    { id: 1, name: "A" },
    { id: 2, name: "B" }
  ];

  it("finds element by id", () => {
    expect(findById(items, 2)).toEqual({ id: 2, name: "B" });
  });

  it("returns undefined if not found", () => {
    expect(findById(items, 3)).toBeUndefined();
  });
});