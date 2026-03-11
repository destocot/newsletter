type SuccessResponse<T> = { data: T; error: null }
type ErrorResponse = { data: null; error: { message: string } }

export type ActionResponse<T> = SuccessResponse<T> | ErrorResponse

function generateResponse<T>(data: T, error?: null): SuccessResponse<T>
function generateResponse(data: null, error: string): ErrorResponse
function generateResponse<T>(
  data: T | null,
  error?: string | null
): ActionResponse<T> {
  if (typeof error === "string") {
    return { data: null, error: { message: error } }
  }
  return { data: data as T, error: null }
}

export { generateResponse }
