// Short alphanumeric seeds for css-doodle (replaces
// randomstring.generate({ length: 4 })). Shared by the editor's Redraw
// button and the gallery thumbnails.
const SEED_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const randomSeed = (length = 4) =>
  Array.from(
    { length },
    () => SEED_CHARS[Math.floor(Math.random() * SEED_CHARS.length)]
  ).join('');
