import Colors from "@app/constants/Colors";

export const buttonStyles = {
  components: {
    Button: {
      variants: {
        "no-hover": {
          _hover: {
            boxShadow: "none",
          },
        },
        "transparent-with-icon": {
          bg: "transparent",
          fontWeight: "bold",
          borderRadius: "inherit",
          cursor: "pointer",
          _hover: "none",
          _active: {
            bg: "transparent",
            transform: "none",
            borderColor: "transparent",
          },
          _focus: {
            boxShadow: "none",
          },
          _hover: {
            boxShadow: "none",
          },
        },
        "primary": {
          bg: Colors.PRIMARY,
          color: "#fff",
          _hover: {
            opacity: .9,
          }
        },
        "secondary": {
          bg: Colors.SECONDARY,
          color: "#fff",
          _hover: {
            opacity: .9,
          }
        },
        "danger": {
          bg: Colors.DANGER,
          color: "#fff",
          _hover: {
            opacity: .9,
          }
        },
        "success": {
          bg: Colors.SUCCESS,
          color: "#fff",
          _hover: {
            opacity: .9,
          }
        }
      },
      baseStyle: {
        borderRadius: "15px",
        _focus: {
          boxShadow: "none",
        },
      },
    },
  },
};
