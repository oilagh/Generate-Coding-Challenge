export enum Category {
  electronics = "electronics",
  apparel = "apparel",
  homeGoods = "home goods",
  sports = "sports",
  beauty = "beauty",
  grocery = "grocery",
  officeSupplies = "office supplies",
  outdoor = "outdoor",
  toys = "toys",
  health = "health",
  automotive = "automotive",
  luxury = "luxury",
  books = "books",
}

export interface Product {
  categories: String[];
  id: string;
  name: string;
  stars: number;
  price: number;
}
