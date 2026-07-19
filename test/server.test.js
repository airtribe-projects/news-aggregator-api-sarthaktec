const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const db = require("../config/db");

let server;
let token = "";

const mockUser = {
    name: "Clark Kent",
    email: "clark@superman.com",
    password: "Krypt()n8",
    preferences: ["movies", "comics"]
};

beforeAll(async () => {
    await db();
    server = supertest(app);
});

afterAll(async () => {
    await mongoose.connection.close();
});

// ================= AUTH =================

describe("Auth", () => {
    test("POST /users/signup", async () => {
        const response = await server.post("/users/signup").send(mockUser);

        expect(response.status).toBe(200);
    });

    test("POST /users/signup with missing email", async () => {
        const response = await server.post("/users/signup").send({
            name: mockUser.name,
            password: mockUser.password
        });

        expect(response.status).toBe(400);
    });

    test("POST /users/login", async () => {
        const response = await server.post("/users/login").send({
            email: mockUser.email,
            password: mockUser.password
        });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeTruthy();

        token = response.body.token;
    });

    test("POST /users/login with wrong password", async () => {
        const response = await server.post("/users/login").send({
            email: mockUser.email,
            password: "wrongpassword"
        });

        expect(response.status).toBe(401);
    });
});

// ================= PREFERENCES =================

describe("Preferences", () => {
    test("PUT /users/preferences", async () => {
        const response = await server
            .put("/users/preferences")
            .set("Authorization", `Bearer ${token}`)
            .send({
                preferences: mockUser.preferences
            });

        expect(response.status).toBe(200);
    });

    test("GET /users/preferences", async () => {
        const response = await server
            .get("/users/preferences")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("preferences");
        expect(response.body.preferences).toEqual(mockUser.preferences);
    });

    test("GET /users/preferences without token", async () => {
        const response = await server.get("/users/preferences");

        expect(response.status).toBe(401);
    });

    test("Update Preferences", async () => {
        const updatedPreferences = ["movies", "comics", "games"];

        const response = await server
            .put("/users/preferences")
            .set("Authorization", `Bearer ${token}`)
            .send({
                preferences: updatedPreferences
            });

        expect(response.status).toBe(200);
    });

    test("Verify Updated Preferences", async () => {
        const response = await server
            .get("/users/preferences")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.preferences).toEqual(["movies", "comics", "games"]);
    });
});

// ================= NEWS =================

describe("News", () => {
    test("GET /news", async () => {
        const response = await server
            .get("/news")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("news");
    });

    test("GET /news without token", async () => {
        const response = await server.get("/news");

        expect(response.status).toBe(401);
    });
});