import { CreateEmployeeInputSchema } from '../lib/validations';
// Use require for resolvers since it's not an ES module
const resolvers = require('./resolvers');

// Manual mock Prisma client
const mockPrisma = {
  employee: {
    create: async (data: any) => ({ id: '1', ...data }),
  },
};

const validInput = {
  firstName: 'John',
  lastName: 'Doe',
  department: 'IT',
  position: 'Developer',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  hireDate: new Date('2020-01-01'),
};

const invalidInput = {
  ...validInput,
  email: 'not-an-email',
};

async function testCreateEmployee() {
  // Test valid input
  try {
    // Zod validation
    CreateEmployeeInputSchema.parse(validInput);

    // Resolver call
    const result = await resolvers.Mutation.createEmployee(
      null,
      { input: validInput },
      { prisma: mockPrisma }
    );
    console.log('Valid input: PASS', result);
  } catch (e: any) {
    console.error('Valid input: FAIL', e);
  }

  // Test invalid input
  try {
    CreateEmployeeInputSchema.parse(invalidInput);
    console.error('Invalid input: FAIL (should not pass)');
  } catch (e: any) {
    console.log('Invalid input: PASS (caught error)', e.errors ? e.errors[0].message : e);
  }
}

testCreateEmployee(); 