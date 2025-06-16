import Spacing from "@app/constants/Spacing";

const PanelContainer = {
  baseStyle: {
    // p: "30px 15px",
    paddingTop: `${Spacing.navbar}px`,
    minHeight: `calc(100vh - ${Spacing.navbar}px)`,
  },
};

export const PanelContainerComponent = {
  components: {
    PanelContainer,
  },
};
