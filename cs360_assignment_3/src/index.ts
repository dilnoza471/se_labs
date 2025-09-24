export function add(a: number, b: number): number {
    return a + b;
}

export function divide(a: number, b: number): number {
    if (b === 0) throw new Error("Cannot divide by zero");
    return a / b;
}


export async function fetchUser(id: number) {
    return new Promise<{ id: number; name: string }>((resolve) => {
        setTimeout(() => {
            resolve({ id, name: "Dilnoza" });
        }, 1000);
    });
}


