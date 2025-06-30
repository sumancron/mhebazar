import Breadcrumb from "@/components/elements/Breadcrumb";
const orders = () => {  
    return (
        <>
       
            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Orders", href: "/orders" },
                ]}
            />
        <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Orders Page</h1>
        <p className="text-gray-600">This is the orders page.</p>
        </div>
        </>
    );
    }
export default orders;