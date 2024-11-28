export const generarId = () =>
  String(
    Date.now().toString(36) +
      Math.random().toString(16)
  ).replace(/\./g, '')
