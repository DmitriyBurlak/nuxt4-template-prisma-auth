export const clearingEmptyValues = (value) => {
  Object.keys(value).forEach((key) => {
    if (!value[key] && value[key] !== null) {
      delete value[key]
    }
  })
  return value
}

export const numberWithSpaces = (number: number) =>  {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}