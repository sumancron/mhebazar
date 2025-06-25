import HomeBanner from "@/components/layout/HomeBanner";
import CategooryButtons from "@/components/home/CategoryButtons";
import MostPopular from "@/components/home/MostPopular";
import NewArrivalsAndTopSearches from "@/components/home/NewArrivalsAndTopSearches";
import SpareParts from "@/components/home/SparepartsFeatured";
import VendorProductsFeatured from "@/components/home/VendorProdcutsFeatured";
import ExportProductsFeatured from "@/components/home/ExportProdcutsFeatured";
import CategoryForm from "@/components/forms/uploadForm/CategoryForm";
import SubcategoryForm from "@/components/forms/uploadForm/SubcategoryForm";
import ProductForm from "@/components/forms/uploadForm/ProductForm";

export default function HomePage() {
  return (
    <>
     

      {/* Home page hero/banner */}
      <HomeBanner />

      {/* Category buttons section */}
      <CategooryButtons />

      <div className="flex flex-col md:flex-row gap-4 w-full px-4 py-8 max-w-7xl mx-auto justify-center items-start">
        <div className="flex-1">
          <MostPopular />
        </div>
        <div className="flex-1">
          <NewArrivalsAndTopSearches />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center">Spare Parts</h1>
      <SpareParts />

      <h1 className="text-3xl font-bold mb-6 text-center">Vendor Products</h1>
      <VendorProductsFeatured />

      <h1 className="text-3xl font-bold mb-6 text-center">Export Products</h1>
      <ExportProductsFeatured />

   
      <CategoryForm />
      <SubcategoryForm />
      <ProductForm />
    </>
  );
}
