"use client";

import { ProductCard } from "@/components/product-card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Papa from "papaparse";

export default function Home() {
  const link = `${process.env.NEXT_PUBLIC_SPREADSHEET_URL}&t=${Date.now()}`;

  const { data, isLoading, error } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await axios.get(link!);
      const parsed = Papa.parse(res.data, { header: true });
      return (parsed.data as any[])
        .filter((row) => row.id && row.name && row.price)
        .map((row) => ({
          id: String(row.id),
          name: String(row.name),
          price: Number(row.price),
          quantity: Number(row.quantity) || 0,
        }));
    },
    staleTime: 0, // data langsung dianggap usang → refetch saat mount
    refetchOnWindowFocus: true, // refetch tiap window/tab fokus
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-4xl mx-auto p-4">
      {data?.map((p: any, i: number) => (
        <div key={p.id}>
          <ProductCard
            id={p.id}
            name={p.name}
            price={p.price}
            quantity={p.quantity}
          />
        </div>
      ))}
    </div>
  );
}
