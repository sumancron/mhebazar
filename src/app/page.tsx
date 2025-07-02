import HomeBanner from "@/components/layout/HomeBanner";
import CategoryButtons from "@/components/home/CategoryButtons";
import MostPopular from "@/components/home/MostPopular";
import NewArrivalsAndTopSearches from "@/components/home/NewArrivalsAndTopSearches";
import SpareParts from "@/components/home/SparepartsFeatured";
import VendorProductsFeatured from "@/components/home/VendorProdcutsFeatured";
import ExportProductsFeatured from "@/components/home/ExportProdcutsFeatured";
// import CategoryForm from "@/components/forms/uploadForm/CategoryForm";
// import SubcategoryForm from "@/components/forms/uploadForm/SubcategoryForm";
// import ProductForm from "@/components/forms/uploadForm/ProductForm";
// import CategoryForm from "@/components/forms/uploadForm/CategoryForm";
// import SubcategoryForm from "@/components/forms/uploadForm/SubcategoryForm";
// import ProductForm from "@/components/forms/uploadForm/ProductForm";

export default function HomePage() {
  return (
    <>
    
      {/* Home page hero/banner */}
      <HomeBanner />

      {/* Category buttons section */}
      <CategoryButtons />

      <div className="flex flex-col md:flex-row gap-4 w-full px-4 py-8 max-w-7xl mx-auto justify-center items-start">
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

   
      {/* <CategoryForm />
      <SubcategoryForm />
      <ProductForm /> */}
    </>
  );
}
