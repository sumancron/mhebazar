import HomeBanner from "@/components/layout/HomeBanner";
import CategoryButtons from "@/components/home/CategoryButtons";
import MostPopular from "@/components/home/MostPopular";
import NewArrivalsAndTopSearches from "@/components/home/NewArrivalsAndTopSearches";
import SpareParts from "@/components/home/SparepartsFeatured";
import VendorProductsFeatured from "@/components/home/VendorProdcutsFeatured";
import ExportProductsFeatured from "@/components/home/ExportProdcutsFeatured";
// import ProductCards from "@/components/test/card";
// import MheWriteAReview from "@/components/test/reviewCard";

export default function HomePage() {
  return (
    <>

      {/* Home page hero/banner */}
      <HomeBanner />

      {/* Category buttons section */}

      <div className="max-w-[90vw] mx-auto">
        <CategoryButtons />

        <div className="flex flex-col md:flex-row gap-14 w-full px-4 py-8 mx-auto justify-center items-start">
          <div className="flex-1">
            <MostPopular />
          </div>
          <div className="flex-1">
            <NewArrivalsAndTopSearches />
          </div>
        </div>

        <SpareParts />


        <VendorProductsFeatured />

        <ExportProductsFeatured />

        {/* <ProductCards />
        <MheWriteAReview  /> */}
      </div>

    </>
  );
}
