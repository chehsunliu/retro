function createTracer() {
  if (import.meta.env.DEV) {
    console.log("Disable tracer");
    return {
      gtag: () => {},
    };
  }

  console.log("Enable tracer");
  return { gtag: window.gtag };
}

export const tracer = createTracer();
