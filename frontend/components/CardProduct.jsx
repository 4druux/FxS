import { motion } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import SpotlightCard from "./ui/SpotlightCard";
import Separator from "./Separator";
import ShinyText from "./button/ShinyText";

const CardProduct = () => {
  const products = [
    {
      id: 1,
      title: "Product 1",
      description: "Description 1",
      image: "/assets/about/discord.jpg",
      price: "$19.99",
    },
    {
      id: 2,
      title: "Product 2",
      description: "Description 2",
      image: "/assets/about/discord.jpg",
      price: "$24.99",
    },
    {
      id: 3,
      title: "Product 3",
      description: "Description 3",
      image: "/assets/about/discord.jpg",
      price: "$29.99",
    },
    {
      id: 4,
      title: "Product 4",
      description: "Description 4",
      image: "/assets/about/discord.jpg",
      price: "$34.99",
    },
    {
      id: 5,
      title: "Product 5",
      description: "Description 5",
      image: "/assets/about/discord.jpg",
      price: "$39.99",
    },
    {
      id: 6,
      title: "Product 6",
      description: "Description 6",
      image: "/assets/about/discord.jpg",
      price: "$44.99",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.02 },
  };

  return (
    <section className="pt-12 pb-16 xl:pt-16 xl:pb-36 bg-[#121212]" id="menu">
      <div className="container mx-auto">
        <div className="flex flex-col space-y-4 mb-12 xl:mb-24 items-center">
          <ShinyText
            text="Our Product"
            speed={2}
            className="tracking-widest text-4xl font-bold text-white/50"
          />
          <Separator bg="accent" />
          <p className="text-center max-w-[620px] mx-auto text-neutral-400 text-md font-medium">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis, ad
            iste. Sunt assumenda aut illum dolorem repellat ut quos officia.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.01 }}
            >
              <SpotlightCard
                className="custom-spotlight-card"
                spotlightColor="rgba(0, 229, 255, 0.2)"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-[210px] object-cover rounded-2xl"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-neutral-100">
                    {product.title}
                  </h3>
                  <p className="text-gray-400">{product.description}</p>
                  <p className="text-gray-300 mt-2">{product.price}</p>

                  {/* Tombol Buy Now */}
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    className={` relative mt-4 px-4 py-2 w-full border border-teal-500/30 rounded-full overflow-hidden
                     hover:border-teal-500/50 bg-teal-900/50 backdrop-blur-sm flex items-center justify-center
                     transition-all duration-300
                  `}
                  >
                    <div
                      className={`text-teal-200 flex items-center bg-clip-text animate-shine`}
                      style={{
                        backgroundImage:
                          "linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, rgba(34, 197, 194, 0.8) 50%, rgba(255, 255, 255, 0) 70%)", // Perbaiki gradient
                        backgroundSize: "200% 100%",
                        WebkitBackgroundClip: "text",
                      }}
                    >
                      <FaShoppingCart className="mr-2" />
                      Buy Now
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardProduct;
