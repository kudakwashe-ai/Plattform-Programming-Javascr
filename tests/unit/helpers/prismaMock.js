const { mockDeep, mockReset } = require('jest-mock-extended');
const prisma = require('../../../prisma/client');

jest.mock('../../../prisma/client', () => ({
    __esModule: true,
    default: mockDeep(),
}));

const prismaMock = prisma;

beforeEach(() => {
    mockReset(prismaMock);
});

module.exports = { prismaMock };
