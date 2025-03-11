// components/CardProduct.jsx
import { motion } from "framer-motion";
import { FaInfoCircle } from "react-icons/fa";
import SpotlightCard from "../../ui/SpotlightCard";
import Separator from "../../ui/Separator";
import ShinyText from "../../text/ShinyText";
import { useContext } from "react";
import { ShopContext } from "@/context/ShopContext";
import { useRouter } from "next/navigation";

const CardProduct = () => {
  const { products, productsError, isLoading } = useContext(ShopContext);
  const router = useRouter();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.02 },
  };

  // Loading state handling
  if (isLoading) {
    return (
      <div className="pt-12 pb-16 xl:pt-16 xl:pb-36 bg-[#121212] flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // Error handling
  if (productsError) {
    return (
      <div className="pt-12 pb-16 xl:pt-16 xl:pb-36 bg-[#121212] flex justify-center items-center">
        <p className="text-red-500">Error: {productsError}</p>
      </div>
    );
  }

  const handleClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  // Render products if available
  return (
    <section className="pt-12 pb-16 xl:pt-16 xl:pb-36 bg-[#121212]" id="menu">
      <div className="container mx-auto">
        <div className="flex flex-col space-y-4 mb-12 xl:mb-24 items-center">
          <ShinyText
            text="Our Product"
            speed={2}
            className="tracking-widest text-4xl font-bold text-white/50"
          />
          <Separator />
          <p className="text-center max-w-[620px] mx-auto text-neutral-400 text-md font-medium">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis, ad
            iste. Sunt assumenda aut illum dolorem repellat ut quos officia.
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12"
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          {products.map((product) => (
            <motion.div
              key={product._id}
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
            >
              <SpotlightCard
                className="custom-spotlight-card"
                spotlightColor="rgba(0, 229, 255, 0.1)"
              >
                {product.media && product.media.length > 0 ? (
                  (() => {
                    const firstMedia = product.media[0];
                    const mediaSrc = `data:${firstMedia.contentType};base64,${firstMedia.data}`;

                    if (firstMedia.contentType.startsWith("image")) {
                      return (
                        <img
                          src={mediaSrc}
                          alt={product.name}
                          className="w-full h-[210px] object-cover rounded-2xl"
                        />
                      );
                    } else if (firstMedia.contentType.startsWith("video")) {
                      return (
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-[210px] object-cover rounded-2xl"
                        >
                          <source
                            src={mediaSrc}
                            type={firstMedia.contentType}
                          />
                          Your browser does not support the video tag.
                        </video>
                      );
                    } else {
                      return (
                        <p>Unsupported media type: {firstMedia.contentType}</p>
                      );
                    }
                  })()
                ) : (
                  <div className="w-full h-[210px] bg-gray-800 flex items-center justify-center rounded-2xl">
                    <p className="text-gray-500">No media available</p>
                  </div>
                )}

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-neutral-100">
                    {product.name}
                  </h3>
                  <p
                    className="text-gray-400 line-clamp-1"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  ></p>
                  {/* REMOVED PRICE */}

                  {/* Updated Button */}
                  <motion.button
                    onClick={() => handleClick(product._id)}
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
                          "linear-gradient(120deg, rgba(255, 255, 255, 0) 30%, rgba(34, 197, 194, 0.8) 50%, rgba(255, 255, 255, 0) 70%)",
                        backgroundSize: "200% 100%",
                        WebkitBackgroundClip: "text",
                      }}
                    >
                      <FaInfoCircle className="mr-2" />
                      Click here for more info
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CardProduct;
