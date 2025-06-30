import Breadcrumb from "@/components/elements/Breadcrumb";
const wishlist = () => {  
    return (
        <>
       
            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Wishlist", href: "/wishlist" },
                ]}
            />
        <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Wishlist Page</h1>
        <p className="text-gray-600">This is the wishlist page.</p>
        </div>
        </>
    );
    }
export default wishlist;