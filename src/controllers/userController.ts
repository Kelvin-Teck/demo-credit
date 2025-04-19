export const retrieveAllTestimonialsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const response = await retrieveAllTestimonialsService(req);

    res
      .status(200)
      .json(sendSuccess("All Testimonials Succesfully Retrieved", response));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json(sendError(errorMessage, 500));
  }
};
