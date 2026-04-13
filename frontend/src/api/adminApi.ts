import axiosClient from './axiosClient';

export const adminSummaryApi = {
  getSummary: async () => {
    return axiosClient.get('/admin/dashboard/summary');
  },
};

export const adminUsersApi = {
  getAll: async () => {
    return axiosClient.get('/admin/users');
  },
  getById: async (id: number | string) => {
    return axiosClient.get(`/admin/users/${id}`);
  },
  create: async (data: Record<string, any>) => {
    return axiosClient.post('/admin/users', data);
  },
  update: async (id: number | string, data: Record<string, any>) => {
    return axiosClient.patch(`/admin/users/${id}`, data);
  },
  remove: async (id: number | string) => {
    return axiosClient.delete(`/admin/users/${id}`);
  },
};

export const adminGamesApi = {
  getAll: async () => {
    return axiosClient.get('/admin/games');
  },
  getById: async (id: number | string) => {
    return axiosClient.get(`/admin/games/${id}`);
  },
  create: async (data: Record<string, any>) => {
    return axiosClient.post('/admin/games', data);
  },
  update: async (id: number | string, data: Record<string, any>) => {
    return axiosClient.patch(`/admin/games/${id}`, data);
  },
  remove: async (id: number | string) => {
    return axiosClient.delete(`/admin/games/${id}`);
  },
};

export const adminPlatformsApi = {
  getAll: async () => {
    return axiosClient.get('/platforms');
  },
  getById: async (id: string | number) => {
    return axiosClient.get(`/platforms/${id}`);
  },
  create: async (data: Record<string, any>) => {
    return axiosClient.post('/platforms', data);
  },
  update: async (id: string | number, data: Record<string, any>) => {
    return axiosClient.put(`/platforms/${id}`, data);
  },
  remove: async (id: string | number) => {
    return axiosClient.delete(`/platforms/${id}`);
  },
};

export const adminCategoriesApi = {
  getAll: async () => {
    return axiosClient.get('/categories');
  },
  getById: async (id: string | number) => {
    return axiosClient.get(`/categories/${id}`);
  },
  create: async (data: Record<string, any>) => {
    return axiosClient.post('/categories', data);
  },
  update: async (id: string | number, data: Record<string, any>) => {
    return axiosClient.put(`/categories/${id}`, data);
  },
  remove: async (id: string | number) => {
    return axiosClient.delete(`/categories/${id}`);
  },
};

export const adminGameCategoriesApi = {
  getAll: async () => {

    return axiosClient.get('/game-categories')
  },
  getByGame: async (gameId: string | number) => {
    return axiosClient.get(`/game-categories/game/${gameId}`);
  },
  create: async (data: { gameId: string | number; categoryId: string | number }) => {
    return axiosClient.post('/game-categories', data);
  },
  update: async (gameId: string | number, categoryId: string | number, data: { newCategoryId: string | number }) => {

    await axiosClient.delete(`/game-categories/game/${gameId}/category/${categoryId}`);
    return axiosClient.post('/game-categories', { gameId, categoryId: data.newCategoryId });
  },
  remove: async (gameId: string | number, categoryId: string | number) => {
    return axiosClient.delete(`/game-categories/game/${gameId}/category/${categoryId}`);
  }
};

export const adminGamePlatformsApi = {
  getAll: async () => {
    return axiosClient.get('/game-platforms');
  },
  getByGame: async (gameId: string | number) => {
    return axiosClient.get(`/game-platforms/game/${gameId}`);
  },
  create: async (data: { gameId: string | number; platformId: string | number }) => {
    return axiosClient.post('/game-platforms', data);
  },
  update: async (gameId: string | number, platformId: string | number, data: { newPlatformId: string | number }) => {
    await axiosClient.delete(`/game-platforms/game/${gameId}/platform/${platformId}`);
    return axiosClient.post('/game-platforms', { gameId, platformId: data.newPlatformId });
  },
  remove: async (gameId: string | number, platformId: string | number) => {
    return axiosClient.delete(`/game-platforms/game/${gameId}/platform/${platformId}`);
  }
};