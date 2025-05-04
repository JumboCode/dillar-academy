/*
purpose: check that the input key is allowed
argument types:
  inputs: object
  allowedFields: array
return type:
  array containing fields that are in allowedFields

example of using to get filters for classes: validateInput(req.query, classFields)
*/
export const validateInput = (input, allowedFields) => {
  const filteredInput = {}

  for (const key in input) {
    if (allowedFields.includes(key)) {
      filteredInput[key] = input[key]
    }
  }

  return filteredInput
}