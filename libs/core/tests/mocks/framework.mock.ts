export const mockFrameworkService = {
  returnInfo: jest.fn(),
};

export const mockFrameworkAdapter = {
  getApps: jest.fn(),
};

export const mockFrameworkFactory = {
  createMicroApp: jest.fn(),
};

export const mockFrameworkMiddleware = {
  notFound: jest.fn(),
  setDomainInfo: jest.fn(),
  setCors: jest.fn(),
  errorHandler: jest.fn(),
};
