import { describe, expect, it } from "vitest";
import { groupBy, having, query, sort, where, type Group } from "./query";

type User = {
  id: number;
  name: string;
  surname: string;
  age: number;
  city: string;
};

const users: User[] = [
  { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
  { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
  { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
  { id: 4, name: "Mike", surname: "Doe", age: 35, city: "LA" },
  { id: 5, name: "Anna", surname: "Smith", age: 28, city: "SF" },
];

describe("query pipeline", () => {
  it("filters by field using where", () => {
    const w = where<User>();
    const search = query<User>(w("name", "John"));

    const result = search(users);

    expect(result).toEqual([
      { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
      { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
      { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
    ]);
  });

  it("filters and sorts users", () => {
    const w = where<User>();
    const s = sort<User>();

    const search = query<User>(
      w("name", "John"),
      w("surname", "Doe"),
      s("age"),
    );

    const result = search(users);

    expect(result).toEqual([
      { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
      { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
      { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
    ]);
  });

  it("sort does not mutate original array", () => {
    const s = sort<User>();
    const original = [...users];

    const result = s("age")(users);

    expect(users).toEqual(original);
    expect(result).not.toBe(users);
  });

  it("groups by city", () => {
    const gb = groupBy<User>();

    const result = gb("city")(users);

    expect(result).toEqual<Group<User, "city">[]>([
      {
        key: "NY",
        items: [
          { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
          { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
        ],
      },
      {
        key: "LA",
        items: [
          { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
          { id: 4, name: "Mike", surname: "Doe", age: 35, city: "LA" },
        ],
      },
      {
        key: "SF",
        items: [
          { id: 5, name: "Anna", surname: "Smith", age: 28, city: "SF" },
        ],
      },
    ]);
  });

  it("filters groups using having", () => {
    const gb = groupBy<User>();
    const h = having<User>();

    const pipeline = query<User>(
      gb("city"),
      h<"city">((group) => group.items.length > 1),
    );

    const result = pipeline(users);

    expect(result).toEqual([
      {
        key: "NY",
        items: [
          { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
          { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
        ],
      },
      {
        key: "LA",
        items: [
          { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
          { id: 4, name: "Mike", surname: "Doe", age: 35, city: "LA" },
        ],
      },
    ]);
  });

  it("supports combined pipeline: where + groupBy + having", () => {
    const w = where<User>();
    const gb = groupBy<User>();
    const h = having<User>();

    const pipeline = query<User>(
      w("surname", "Doe"),
      gb("city"),
      h<"city">((group) => group.items.some((u) => u.age > 34)),
    );

    const result = pipeline(users);

    expect(result).toEqual([
      {
        key: "LA",
        items: [
          { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
          { id: 4, name: "Mike", surname: "Doe", age: 35, city: "LA" },
        ],
      },
    ]);
  });

  it("returns original data when query has no steps", () => {
    const pipeline = query<User>();
    const result = pipeline(users);

    expect(result).toEqual(users);
  });
});