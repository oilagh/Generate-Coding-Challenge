import request from "supertest";
import app from "../app";

describe("Express App", () => {
  it("must return 200 status code", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "healthy" });
  });

  it("first test to print out result", async () => {
    const response = await request(app).get(
      "/api/v1/products?sort=name" +
        "&order=desc&categories=home%20goods&offset=1&limit=1&price_min=0&price_max=10000&star_min=0&star_max=500"
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        categories: ["home goods"],
        id: "TOO35791",
        name: "Philips Sonicare 4100 Electric Toothbrush",
        price: 4900,
        stars: 271,
      },
    ]);
  });

  it("show that limit works as intended", async () => {
    const response = await request(app).get(
      "/api/v1/products?sort=name" +
        "&order=desc&categories=home%20goods&offset=1&limit=3&price_min=0&price_max=10000&star_min=0&star_max=500"
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        categories: ["home goods"],
        id: "TOO35791",
        name: "Philips Sonicare 4100 Electric Toothbrush",
        price: 4900,
        stars: 271,
      },
      {
        categories: ["home goods"],
        id: "OXO35791",
        name: "OXO Brew Conical Burr Coffee Grinder",
        price: 8900,
        stars: 276,
      },
      {
        categories: ["home goods"],
        id: "GRI35781",
        name: "Cuisinart 5-in-1 Griddler",
        price: 7000,
        stars: 403,
      },
    ]);
  });

  it(
    "show that descending order works as intended that limit works as intended" +
      "( all are different because total list is large and start from top now)",
    async () => {
      const response = await request(app).get(
        "/api/v1/products?sort=name" +
          "&order=asc&categories=home%20goods&offset=1&limit=3&price_min=0&price_max=10000&star_min=0&star_max=500"
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          categories: ["home goods"],
          id: "OXO35791",
          name: "OXO Brew Conical Burr Coffee Grinder",
          price: 8900,
          stars: 276,
        },
        {
          categories: ["home goods"],
          id: "TOO35791",
          name: "Philips Sonicare 4100 Electric Toothbrush",
          price: 4900,
          stars: 271,
        },
        {
          categories: ["electronics", "home goods"],
          id: "STR35791",
          name: "Roku Streaming Stick 4K",
          price: 5000,
          stars: 439,
        },
      ]);
    }
  );

  it("show invalid construction with negative values", async () => {
    const response = await request(app).get(
      "/api/v1/products?sort=name" +
        "&order=desc&categories=home%20goods&offset=1&limit=1&price_min=0&price_max=-100&star_min=0&star_max=500"
    );
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      msg: "Product is not a valid product.",
      statusCode: 400,
    });
  });

  it("able to not include a category field and all are included", async () => {
    const response = await request(app).get(
      "/api/v1/products/?sort=name&order=desc&offset=1&limit=4&price_min=0&price_max=10000&star_min=0&star_max=10000"
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        categories: ["home goods"],
        id: "TOO35791",
        name: "Philips Sonicare 4100 Electric Toothbrush",
        price: 4900,
        stars: 271,
      },
      {
        categories: ["home goods"],
        id: "OXO35791",
        name: "OXO Brew Conical Burr Coffee Grinder",
        price: 8900,
        stars: 276,
      },
      {
        categories: ["grocery"],
        id: "YZA13579",
        name: "Oreo Original Cookies",
        price: 400,
        stars: 471,
      },
      {
        categories: ["home goods"],
        id: "GRI35781",
        name: "Cuisinart 5-in-1 Griddler",
        price: 7000,
        stars: 403,
      },
    ]);
  });
});
