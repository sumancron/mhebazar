// src/app/product/[product]/page.tsx
import ProductSection from "@/components/products/IndividualProduct";
// import ReviewSection from "@/components/products/Reviews";

// Define the generateMetadata function for dynamic metadata
export async function generateMetadata({ params }: { params: { product: string } }) {
  const productSlug = params.product;
  // In a real application, you would fetch the product data here to get
  // the actual meta_title and meta_description.
  // For now, we'll use a placeholder or derive from slug.

  // NOTE: Direct API call from server components might be needed here
  // if you want to set dynamic metadata based on fetched product data.
  // For this example, we'll keep it simple as the client component fetches.
  // If you need real SEO, this part requires server-side data fetching.

  const productName = productSlug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: `${productName} - MHE Product Details`,
    description: `Detailed information about ${productName} and customer reviews.`,
  };
}

export default function IndividualProductPage({ params }: { params: { product: string } }) {
  const { product: productSlug } = params;

  return (
    <>
      {/* ProductSection will fetch its own data based on productSlug */}
      <ProductSection productSlug={productSlug} />
      {/* ReviewSection needs the actual product ID. We will pass null initially
          and Reviews.tsx will fetch reviews by slug (or fallback) if product ID
          cannot be derived directly from the URL slug here.
          A better approach for reviews would be to have ProductSection pass
          the fetched product.id to ReviewSection once it's available.
          For now, Reviews.tsx will fetch reviews based on slug (assuming it can handle it)
          or use fallback data.
          To properly link, IndividualProduct should pass the real productId to ReviewSection once data is loaded.
      */}
      {/* Temporary: For now, ReviewSection won't be dynamically linked by ID here.
          It should ideally be inside IndividualProduct.tsx OR receive the product ID
          from IndividualProduct.tsx via a state/context or have its own slug-to-id mapping.
          Let's adjust Reviews.tsx to be able to receive productId OR handle the slug.
          For cleaner structure, IndividualProduct will pass the ID.
      */}
      {/* ReviewSection is now placed within IndividualProduct.tsx or adjusted to accept productId */}
      {/* Re-evaluating: It makes more sense for `ReviewSection` to be a child of `IndividualProduct`
          so it can receive the actual `productId` once it's resolved.
          Removing `ReviewSection` from `page.tsx` and adding it to `IndividualProduct.tsx`
          is a more robust solution. Let's adjust `IndividualProduct.tsx` to include `ReviewSection`.
      */}
      {/* Reverting: ReviewSection is a separate section on the page, so it should be
          a sibling. But to get the product ID, IndividualProduct has to fetch it first.
          A common pattern is to fetch product data in the parent (this page) and pass
          it down to children. However, given the current client-side fetching in
          IndividualProduct, let's keep it separate but ensure ReviewSection can also
          determine the product ID.
          The cleanest way for now is to pass the slug to ReviewSection and let it
          perform its own lookup or use fallback. Or, have IndividualProduct pass the ID
          to ReviewSection as a prop *after* it has successfully fetched the product.
          Given the constraint of 'no red lines', the latter is better.
          So, `ReviewSection` will remain here, and it needs to determine the product ID
          from the slug or be passed the ID from `IndividualProduct`'s state.
          The simplest is for ReviewSection to perform its own ID lookup based on slug.
          However, that's redundant API calls.

          **Best approach (within current constraints):**
          IndividualProduct.tsx will fetch product data by slug,
          and then pass the *numerical product ID* to ReviewSection.
          This means ReviewSection will become a child of IndividualProduct or
          IndividualProduct needs to pass a callback to update a state in page.tsx,
          which is more complex.

          Let's modify `IndividualProduct.tsx` to fetch the product and then
          render `ReviewSection` *inside* it, passing the `productId`
          as a prop. This will ensure `ReviewSection` only loads once
          the `productId` is successfully determined.
      */}
    </>
  );
}