import ShinyText from "./Button/ShinyText";
import Menuitem from "./Ui/Menuitem";
import Separator from "./Separator";
import LinkButton from "./Button/LinkButton";

const menuItems = [
  {
    imgSrc: "/assets/menu/coffee-1.png",
    name: "Espresso",
    description: "Cafe with rich espresso and steamed milk",
    price: 3.3,
  },
  {
    imgSrc: "/assets/menu/coffee-2.png",
    name: "Capuccino",
    description: "Espresso with milk and steamed milk",
    price: 4.5,
  },
  {
    imgSrc: "/assets/menu/coffee-3.png",
    name: "Latte",
    description: "Latte with milk and steamed milk",
    price: 3.5,
  },
  {
    imgSrc: "/assets/menu/coffee-4.png",
    name: "Americano",
    description: "Americano with milk and steamed milk",
    price: 3.7,
  },
  {
    imgSrc: "/assets/menu/coffee-5.png",
    name: "Mocha",
    description: "Mocha with milk and steamed milk",
    price: 5.3,
  },
  {
    imgSrc: "/assets/menu/coffee-1.png",
    name: "Macchiato",
    description: "Macchiato with milk and steamed milk",
    price: 3.99,
  },
  {
    imgSrc: "/assets/menu/coffee-2.png",
    name: "Flat White",
    description: "Flat White with milk and steamed milk",
    price: 5.1,
  },
  {
    imgSrc: "/assets/menu/coffee-3.png",
    name: "Iced Coffee",
    description: "Iced White with milk and steamed milk",
    price: 4.2,
  },
  {
    imgSrc: "/assets/menu/coffee-4.png",
    name: "Affogato",
    description: "Affogato White with milk and steamed milk",
    price: 4.2,
  },
  {
    imgSrc: "/assets/menu/coffee-4.png",
    name: "Irrish Coffee",
    description: "Coffee with milk and steamed milk",
    price: 4.2,
  },
];

const Menu = () => {
  return (
    <section className="pt-12 pb-16 xl:pt-16 xl:pb-36 bg-[#121212]" id="menu">
      <div className="container mx-auto">
        <div className="flex flex-col gap-4 mb-12 xl:mb-24">
          <ShinyText
            text="Our Product"
            speed={3}
            className="text-center tracking-widest text-4xl font-bold text-white/50"
          />
          <div className="mb-4">
            <Separator bg="accent" />
          </div>
          <p className="text-center max-w-[620px] mx-auto text-neutral-400 text-md font-medium">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis, ad
            iste. Sunt assumenda aut illum dolorem repellat ut quos officia.
          </p>
        </div>
        {/* Menu & button */}
        <div className="flex flex-col items-center gap-12 xl:gap-24">
          {/* menu grid*/}
          <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-y-8 gap-x-16 place-content-center">
            {menuItems.map((item, index) => {
              const { name, imgSrc, description, price } = item;
              return (
                <Menuitem
                  name={name}
                  imgSrc={imgSrc}
                  description={description}
                  price={price}
                  key={index}
                />
              );
            })}
          </div>
          <LinkButton href="/" text="View Full Product" />
        </div>
      </div>
    </section>
  );
};

export default Menu;
