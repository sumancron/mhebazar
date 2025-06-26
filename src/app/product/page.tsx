import { notFound } from "next/navigation";
import ProductSection from "@/components/products/IndividualProduct";
import ReviewSection from "@/components/products/Reviews";

// Dummy: Valid product slugs (replace with real DB/API check)
const validSlugs = [
  "she-forklift-tyre",
  "mhe-bazar-engine-oil-filter",
];

export default function IndividualProduct({ params }: { params: { product: string } }) {
  const { product } = params;

  // Agar slug valid nahi hai toh 404 dikhao
  if (!validSlugs.includes(product)) {
    notFound();
  }

  return (
    <>
      <ProductSection slug={product} />
      <ReviewSection slug={product} />
    </>
  );
}