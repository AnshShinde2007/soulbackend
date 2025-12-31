export function formatValidationErrors(errors) {
  const formatted = {};

  for (const error of errors) {
    if (error.constraints) {
      formatted[error.property] = Object.values(error.constraints);
    }
  }

  return formatted;
}
