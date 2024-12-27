import express from "express";
import { Request, Response } from "express";
import { Category, Product } from "../models/product";
const productController = () => {
  const router = express.Router();

  interface FilterProductsRequest extends Request {
    query: {
      sort: string;
      order: "asc" | "desc";
      categories: string;
      offset: string;
      limit: string;
      price_min: string;
      price_max: string;
      star_min: string;
      star_max: string;
    };
  }

  interface ParsedFilterProductsRequest {
    sort: string;
    order: "asc" | "desc";
    categories: string[];
    offset: number;
    limit: number;
    price_min: number;
    price_max: number;
    star_min: number;
    star_max: number;
  }

  function filterStars(
    products: Product[],
    maxStars: number,
    minStars: number
  ): Product[] {
    const newProducts: Product[] = products.filter(
      (product) => product.stars >= minStars && product.stars <= maxStars
    );
    return newProducts;
  }

  function filterPrice(
    products: Product[],
    maxPrice: number,
    minPrice: number
  ): Product[] {
    const newProducts: Product[] = products.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice - 100
    );
    return newProducts;
  }

  function filterCategories(products: Product[], cats: String[]): Product[] {
    const newProducts: Product[] = products.filter((product) => {
      for (const category of cats) {
        if (product.categories.includes(category)) {
          return true;
        }
      }

      if (cats.length == 0) {
        return true;
      }
      return false;
    });
    return newProducts;
  }

  function sortProducts(
    products: Product[],
    order: String,
    rule: String
  ): Product[] {
    let newProducts: Product[] = [];
    if (rule == "name") {
      newProducts = products.sort((product1, product2) =>
        product1.name.localeCompare(product2.name)
      );
    } else if (rule == "stars") {
      newProducts = products.sort(
        (product1, product2) => product1.stars - product2.stars
      );
    } else if (rule == "price") {
      newProducts = products.sort(
        (product1, product2) => product1.price - product2.price
      );
    }

    if (order == "desc") {
      newProducts = newProducts.reverse();
    }
    return newProducts;
  }

  function limitProducts(
    products: Product[],
    start: number,
    end: number
  ): Product[] {
    return products.slice(start, end);
  }

  const filterProduct = async (req: FilterProductsRequest, res: Response) => {
    try {
      const parsedReq = parseRequest(req);
      validateRequest(parsedReq);
      const stars = filterStars(
        listProducts,
        parsedReq.star_max,
        parsedReq.star_min
      );
      const prices = filterPrice(
        stars,
        parsedReq.price_max,
        parsedReq.price_min
      );
      const categories = filterCategories(prices, parsedReq.categories);
      const sorted = sortProducts(categories, parsedReq.order, parsedReq.sort);
      const limits = limitProducts(sorted, parsedReq.offset, parsedReq.limit);
      res.status(200).json(limits);
    } catch (error) {
      if (error instanceof RangeError) {
        res.status(400).json({ msg: error.message, statusCode: 400 });
      } else {
        res.status(500).json({ msg: "Internal Server Error", statusCode: 500 });
      }
    }
  };

  function validateRequest(req: ParsedFilterProductsRequest) {
    if (
      req.limit < 0 ||
      req.price_max < 0 ||
      req.price_min < 0 ||
      req.offset < 0 ||
      req.star_max < 0 ||
      req.star_min < 0
    ) {
      throw RangeError;
    }
  }

  function parseRequest(
    req: FilterProductsRequest
  ): ParsedFilterProductsRequest {
    try {
      const parsedReq = {
        sort: req.query.sort,
        order: req.query.order,
        categories: req.query.categories.replace("%20", " ").split(","),
        offset: parseInt(req.query.offset),
        limit: parseInt(req.query.limit),
        price_min: parseInt(req.query.price_min),
        price_max: parseInt(req.query.price_max),
        star_min: parseInt(req.query.star_min),
        star_max: parseInt(req.query.star_max),
      };
      return parsedReq;
    } catch {
      // implement custom error
      throw new Error();
    }
  }

  const listProducts: Product[] = [
    {
      id: "GRI35781",
      name: "Cuisinart 5-in-1 Griddler",
      categories: ["home goods"],
      stars: 403,
      price: 7000,
    },
    {
      id: "POT24680",
      name: "Instant Pot Duo Plus 9-in-1 Electric Pressure Cooker",
      categories: ["home goods"],
      stars: 485,
      price: 12000,
    },
    {
      id: "PQR35791",
      name: "Samsung 65-inch QN90B Neo QLED 4K Smart TV",
      categories: ["electronics", "home goods"],
      stars: 410,
      price: 149900,
    },
    {
      id: "FIT13579",
      name: "Bowflex SelectTech Adjustable Dumbbells",
      categories: ["sports", "home goods"],
      stars: 469,
      price: 32900,
    },
    {
      id: "TCL24680",
      name: "TCL 55-inch 4K UHD Smart TV",
      categories: ["electronics"],
      stars: 208,
      price: 37900,
    },
    {
      id: "TOO35791",
      name: "Philips Sonicare 4100 Electric Toothbrush",
      categories: ["home goods"],
      stars: 271,
      price: 4900,
    },
    {
      id: "BLK46802",
      name: "Pendleton Yakima Camp Throw Blanket",
      categories: ["home goods", "outdoor"],
      stars: 472,
      price: 18000,
    },
    {
      id: "MKB13579",
      name: "Apple Magic Keyboard",
      categories: ["electronics", "office supplies"],
      stars: 285,
      price: 9900,
    },
    {
      id: "GMT35791",
      name: "Garmin Fenix 6 Pro GPS Smartwatch",
      categories: ["electronics", "sports"],
      stars: 466,
      price: 55000,
    },
    {
      id: "COF46802",
      name: "Breville Espresso Machine",
      categories: ["home goods"],
      stars: 491,
      price: 69900,
    },
    {
      id: "LPT35791",
      name: "ASUS ROG Zephyrus G14 Gaming Laptop",
      categories: ["electronics"],
      stars: 478,
      price: 159900,
    },
    {
      id: "STR35791",
      name: "Roku Streaming Stick 4K",
      categories: ["electronics", "home goods"],
      stars: 439,
      price: 5000,
    },
    {
      id: "YZA13579",
      name: "Oreo Original Cookies",
      categories: ["grocery"],
      stars: 471,
      price: 400,
    },
    {
      id: "THG13579",
      name: "Theragun Elite Massage Gun",
      categories: ["health", "sports"],
      stars: 216,
      price: 39900,
    },
    {
      id: "OXO35791",
      name: "OXO Brew Conical Burr Coffee Grinder",
      categories: ["home goods"],
      stars: 276,
      price: 8900,
    },
  ];

  router.get("/api/v1/products", filterProduct);

  return router;
};
export default productController;
