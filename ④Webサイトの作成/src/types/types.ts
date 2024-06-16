// types/types.ts
export interface Product {
  id: string;
  series: string;
  no: string;
  name: string; // name field treated as title
  sp: string;
  rarity: string;
  effect: string[]; // Assuming effect is an array of strings
  flavor: string;
  category: string[];
  type: string[];
  color: string[];
  lv: string;
  grow_cost: string;
  cost: string;
  limit: string;
  power: string;
  variable1: string;
  variable2: string[];
  format: string[];
  story: string;
}
