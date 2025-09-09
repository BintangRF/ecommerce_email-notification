import { ProductCard } from "@/components/product-card";
import items from "../data/items.json";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-4xl mx-auto p-4">
      {items?.map((p: any, i: number) => (
        <div key={p.id}>
          <ProductCard id={p.id} name={p.name} price={p.price} />
        </div>
      ))}
    </div>
  );
}
