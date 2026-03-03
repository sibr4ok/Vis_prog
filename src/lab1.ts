interface User {
    id: number;
    name: string;
    email?: string;
    isActive: boolean;
}

export function createUser(
    id: number,
    name: string,
    email?: string,
    isActive: boolean = true
): User {
    return {
        id,
        name,
        email,
        isActive,
    };
}


const user1 = createUser(1, "Alice");
const user2 = createUser(2, "Bob", "bob@example.com", false);

console.log(user1);
console.log(user2);




type Genre = "fiction" | "non-fiction";

interface Book {
    title: string;
    author: string;
    year?: number;
    genre: Genre;
}

export function createBook(book: Book): Book {
    return book;
}

const book1 = createBook({
    title: "1984",
    author: "George Orwell",
    year: 1949,
    genre: "fiction",
});

const book2 = createBook({
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "non-fiction",
});

console.log("\nBooks:");
console.log(book1);
console.log(book2);




export function calculateArea(shape: "circle", radius: number): number;
export function calculateArea(shape: "square", side: number): number;

export function calculateArea(shape: "circle" | "square", value: number): number {
    if (shape === "circle") {
        return Math.PI * value * value;
    } else {
        return value * value;
    }
}
console.log("\nAreas:");
console.log("Circle area:", calculateArea("circle", 5));
console.log("Square area:", calculateArea("square", 4));




type Status = "active" | "inactive" | "new";
export function getStatusColor(status: Status): string {
    switch (status) {
        case "active":
            return "green";
        case "inactive":
            return "gray";
        case "new":
            return "blue";
    }
}

console.log("\nStatus colors:");
console.log(getStatusColor("active"));
console.log(getStatusColor("inactive"));
console.log(getStatusColor("new"));




type StringFormatter = (str: string, uppercase?: boolean) => string;

export const capitalizeFirst: StringFormatter = (str, uppercase = false) => {
    if (!str) return str;
    // @ts-ignore
    const result = str[0].toUpperCase() + str.slice(1);
    return uppercase ? result.toUpperCase() : result;
};

export const trimAndFormat: StringFormatter = (str, uppercase = false) => {
    const trimmed = str.trim();
    return uppercase ? trimmed.toUpperCase() : trimmed;
};

console.log("\nStringFormatter:");
console.log(capitalizeFirst("hello"));
console.log(trimAndFormat("  hello world  ", true));




export function getFirstElement<T>(arr: T[]): T | undefined {
    return arr.length > 0 ? arr[0] : undefined;
}

console.log("\nGeneric getFirstElement:");
console.log(getFirstElement([10, 20, 30]));
console.log(getFirstElement(["apple", "banana"]));
console.log(getFirstElement([]));


interface HasId {
    id: number;
}

export function findById<T extends HasId>(items: T[], id: number): T | undefined {
    for (const item of items) {
        if (item.id === id) {
            return item;
        }
    }
    return undefined;
}


const users: User[] = [
    { id: 1, name: "Alice", isActive: true },
    { id: 2, name: "Bob", isActive: false },
];

console.log("\nfindById:");
console.log(findById(users, 2));


