// components/ui/ScrollVelocity.js
import { useRef, useLayoutEffect, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { Coolshape } from "coolshapes-react";

function useElementWidth(ref) {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [ref]);
  return width;
}

export const ScrollVelocity = ({
  scrollContainerRef,
  texts = [],
  velocity = 100,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName,
  scrollerClassName,
  parallaxStyle,
  scrollerStyle,
  separator = <Coolshape className="inline-block mx-2" />,
}) => {
  function VelocityText({
    children,
    baseVelocity = velocity,
    scrollContainerRef,
    className = "",
    damping,
    stiffness,
    numCopies,
    velocityMapping,
    parallaxClassName,
    scrollerClassName,
    parallaxStyle,
    scrollerStyle,
    separator, 
  }) {
    const baseX = useMotionValue(0);
    const scrollOptions = scrollContainerRef
      ? { container: scrollContainerRef }
      : {};
    const { scrollY } = useScroll(scrollOptions);
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
      damping: damping ?? 50,
      stiffness: stiffness ?? 400,
    });
    const velocityFactor = useTransform(
      smoothVelocity,
      velocityMapping?.input || [0, 1000],
      velocityMapping?.output || [0, 5],
      { clamp: false }
    );
    const copyRef = useRef(null);
    const copyWidth = useElementWidth(copyRef);

    const [dynamicNumCopies, setDynamicNumCopies] = useState(numCopies); 
    function wrap(min, max, v) {
      const range = max - min;
      return ((((v - min) % range) + range) % range) + min;
    }

    const x = useTransform(baseX, (v) => {
      if (copyWidth === 0) return "0px";
      return `${wrap(-copyWidth * dynamicNumCopies, 0, v)}px`; 
    });

    const directionFactor = useRef(1);

    useAnimationFrame((t, delta) => {
      let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }

      moveBy += directionFactor.current * moveBy * velocityFactor.get();
      baseX.set(baseX.get() + moveBy);
    });

    const combinedElements = [];
    combinedElements.push(
      <Coolshape
        key={`coolshape-start`}
        className="inline-block mx-8 h-12 w-12"
      />
    );
    for (let i = 0; i < texts.length; i++) {
      combinedElements.push(<span key={`text-${i}`}>{texts[i]}</span>);
      if (i < texts.length - 1) {
        combinedElements.push(
          <Coolshape
            key={`coolshape-${i}`}
            className="inline-block mx-8 h-12 w-12"
          />
        );
      }
    }

    useLayoutEffect(() => {
      function updateDynamicNumCopies() {
        if (copyRef.current) {
          const singleCopyWidth = copyRef.current.offsetWidth; 
          const windowWidth = window.innerWidth;
          const neededCopies = Math.ceil(windowWidth / singleCopyWidth) + 4; 
          setDynamicNumCopies(Math.max(neededCopies, numCopies)); 
        }
      }

      updateDynamicNumCopies();
      window.addEventListener("resize", updateDynamicNumCopies);
      return () => window.removeEventListener("resize", updateDynamicNumCopies);
    }, [copyRef, numCopies]);

    const spans = [];
    for (let i = 0; i < dynamicNumCopies; i++) {
      spans.push(
        <span
          className={`flex-shrink-0 ${className}`}
          key={i}
          ref={i === 0 ? copyRef : null}
        >
          {combinedElements}
        </span>
      );
    }

    return (
      <div
        className={`${parallaxClassName} relative overflow-hidden`}
        style={parallaxStyle}
      >
        <motion.div
          className={`${scrollerClassName} flex whitespace-nowrap text-center font-sans text-4xl font-bold tracking-[-0.02em] drop-shadow md:text-[5rem] md:leading-[5rem]`}
          style={{ x, ...scrollerStyle }}
        >
          {spans}
        </motion.div>
      </div>
    );
  }

  return (
    <VelocityText
      className={className}
      baseVelocity={velocity}
      scrollContainerRef={scrollContainerRef}
      damping={damping}
      stiffness={stiffness}
      numCopies={numCopies}
      velocityMapping={velocityMapping}
      parallaxClassName={parallaxClassName}
      scrollerClassName={scrollerClassName}
      parallaxStyle={parallaxStyle}
      scrollerStyle={scrollerStyle}
      separator={separator}
    />
  );
};

export default ScrollVelocity;
