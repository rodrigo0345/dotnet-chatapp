import React, { useCallback, useEffect, useRef, useState } from "react";

const ScrollContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => {
  const outerDiv = useRef<HTMLDivElement | null>(null);
  const innerDiv = useRef<HTMLDivElement | null>(null);
  const prevInnerDivHeight = useRef<HTMLDivElement | null>(null);

  const [showScrollButton, setShowScrollButton] = useState(false);

  // scroll smoothly on change of children
  useEffect(() => {
    const outerDivHeight = outerDiv.current?.clientHeight;
    const innerDivHeight = innerDiv.current?.clientHeight;
    const outerDivScrollTop = outerDiv.current?.scrollTop;

    if (
      !prevInnerDivHeight.current ||
      outerDivScrollTop ===
        (prevInnerDivHeight.current as any) - (outerDivHeight as any)
    ) {
      outerDiv.current?.scrollTo({
        top: innerDivHeight! - outerDivHeight!,
        left: 0,
        behavior: prevInnerDivHeight.current ? "smooth" : "auto",
      });
    } else {
      setShowScrollButton(true);
    }

    prevInnerDivHeight.current = innerDivHeight as any;
  }, [children]);

  const handleScrollButtonClick = useCallback(() => {
    const outerDivHeight = outerDiv.current!.clientHeight;
    const innerDivHeight = innerDiv.current!.clientHeight;

    outerDiv.current!.scrollTo({
      top: innerDivHeight! - outerDivHeight!,
      left: 0,
      behavior: "smooth",
    });

    setShowScrollButton(false);
  }, []);

  return (
    <div
      className={className}
      ref={outerDiv}
      style={{
        overflowY: "scroll",
      }}
    >
      <div
        ref={innerDiv}
        style={{
          position: "relative",
        }}
      >
        {children}
      </div>
      <button
        style={{
          position: "absolute",
          backgroundColor: "red",
          color: "white",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: showScrollButton ? 1 : 0,
          pointerEvents: showScrollButton ? "auto" : "none",
        }}
        onClick={handleScrollButtonClick}
      ></button>
    </div>
  );
};

export default ScrollContainer;
