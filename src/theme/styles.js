const styles = {
  global: {
    "html, body": {
      backgroundColor: "white",
      color: "gray.800",
      minHeight: "100%",
    },
    "#root": { minHeight: "100vh" },
    svg: {
      cursor: "pointer",
    },
    ".table": {
      border: "none",
      backgroundColor: "transparent",
      boxShadow: "none",
      overflow: "visible",
    },
    ".tr": {
      display: "flex",
      width: "100%",
    },
    ".td": {
      overflow: "hidden",
      padding: 0,
    },
    ".th, .td": { backgroundColor: "transparent" },
    ".th": {
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "gray.500",
      padding: "0.625rem",
      fontWeight: 700,
      fontSize: "xs",
      textTransform: "uppercase",
      textAlign: "center",
      bg: "transparent",
    },
    ".td > input": {
      margin: 0,
      padding: "0.25rem 0.5rem",
      maxW: "100%",
      minWidth: 0,
      boxSizing: "border-box",
    },
    ".date-wrapper": {
      display: "flex",
      alignItems: "center",
      w: "100%",
      h: "100%",
    },
    ".resizer": {
      position: "absolute",
      opacity: 0,
      top: 0,
      right: 0,
      h: "100%",
      w: "5px",
      bg: "#27bbff",
      cursor: "col-resize",
      userSelect: "none",
      touchAction: "none",
      borderRadius: "6px",
    },
    ".resizer.isResizing": {
      bg: "#2eff31",
      opacity: 1,
    },
    "*:hover > .resizer": {
      opacity: 1,
    },
  },
};

export default styles;
