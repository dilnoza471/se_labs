import {add, divide, fetchUser} from "./index";

describe("math functions", ()=>{
    test("adds two numbers", ()=>{
        expect(add(1, 2)).toBe(3);
    });

    test("divides two numbers", ()=>{
        expect(divide(8, 2)).toBe(4);
    });

    test("throws when divided by zero", ()=>{
        expect(() => divide(1, 0)).toThrow();
    })
});

describe('async functions', () => {
    test("fetchUser returns user", async () => {
        const user = await fetchUser(1);
        expect(user).toEqual({ id: 1, name: "Dilnoza" });
    });

});
