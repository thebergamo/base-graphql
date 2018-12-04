import { createError } from "apollo-errors";

export const UnknownError = createError("UnknownError", {
  message: "An unknown error has occurred!  Please try again later"
});

export const ForbiddenError = createError("ForbiddenError", {
  message: "You cannot perform this action"
});

export const UnauthenticatedError = createError("UnauthenticatedError", {
  message: "You must be authenticated"
});

export const ResourceError = createError("ResourceError", {
  message: "Invalid Resource"
});

export const CredentialsError = createError("CredentialsError", {
  message: "Credentials does not match"
});
