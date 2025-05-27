import { Camera, Laptop, Video, Smartphone } from "lucide-react";

export default function CategoriesSection() {
  const categories = [
    {
      name: "Camera",
      icon: Camera,
      count: "50+ sản phẩm",
      color: "bg-blue-500",
    },
    {
      name: "Laptop",
      icon: Laptop,
      count: "30+ sản phẩm",
      color: "bg-purple-500",
    },
    {
      name: "Flycam",
      icon: Video,
      count: "25+ sản phẩm",
      color: "bg-green-500",
    },
    {
      name: "Dashcam",
      icon: Smartphone,
      count: "40+ sản phẩm",
      color: "bg-orange-500",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Danh mục sản phẩm
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá các danh mục sản phẩm công nghệ đa dạng với chất lượng cao
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white rounded-lg overflow-hidden"
              >
                <div className="p-6 text-center">
                  <div
                    className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{category.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
