import { openGlobalModal } from "@app/redux/app/slice";

export function showModal(
  dispatch,
  options
) {
  dispatch &&
    dispatch(
      openGlobalModal({
        title: options?.title,
        message: options?.message,
        status: options?.status || "success",
      })
    );
}
