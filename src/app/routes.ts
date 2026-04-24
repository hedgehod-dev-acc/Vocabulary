export const routes = {
  add: "/add",
  words: "/words",
  sets: "/sets",
  setDetail: (id: string) => `/sets/${id}`,
} as const;

export const routePatterns = {
  add: "/add",
  words: "/words",
  sets: "/sets",
  setDetail: "/sets/:setId",
} as const;
