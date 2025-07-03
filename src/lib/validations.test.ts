import * as validations from './validations';

function testSchema(schema: any, valid: any, invalid: any, name: string) {
  try {
    schema.parse(valid);
    console.log(`${name} valid: PASS`);
  } catch (e: any) {
    console.error(`${name} valid: FAIL`, e.errors || e);
  }
  try {
    schema.parse(invalid);
    console.error(`${name} invalid: FAIL (should not pass)`);
  } catch (e: any) {
    console.log(`${name} invalid: PASS`, e.errors ? e.errors[0].message : e);
  }
}

// Test CreateEmployeeInputSchema
const validEmployee = {
  firstName: 'John',
  lastName: 'Doe',
  department: 'IT',
  position: 'Developer',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  hireDate: new Date('2020-01-01')
};
const invalidEmployee = {
  firstName: '', // empty
  lastName: 'Doe',
  department: 'IT',
  position: 'Developer',
  email: 'not-an-email',
  phone: '123',
  hireDate: new Date('2030-01-01') // future date
};
testSchema(validations.CreateEmployeeInputSchema, validEmployee, invalidEmployee, 'CreateEmployeeInputSchema');

// Test CreateAssetInputSchema
const validAsset = {
  assetName: 'Laptop',
  assetType: 'Electronics',
  purchasePrice: 1200.5,
  purchaseDate: new Date('2022-01-01'),
  warrantyExpiry: new Date('2023-01-01'),
  supplierId: 'supplier-1',
  employeeId: 'employee-1'
};
const invalidAsset = {
  assetName: '', // empty
  assetType: '', // empty
  purchasePrice: -100,
  purchaseDate: new Date('2025-01-01'), // future date
  warrantyExpiry: new Date('2020-01-01'), // before purchase
  supplierId: '',
  employeeId: ''
};
testSchema(validations.CreateAssetInputSchema, validAsset, invalidAsset, 'CreateAssetInputSchema');

// Test CreateBufferStockInputSchema
const validBufferStock = {
  itemName: 'Paper',
  itemType: 'Stationery',
  quantityAvailable: 100,
  minimumStockLevel: 10,
  maximumStockLevel: 200,
  managedBy: 'manager-1',
  autoReorderEnabled: true
};
const invalidBufferStock = {
  itemName: '', // empty
  itemType: '', // empty
  quantityAvailable: -5,
  minimumStockLevel: 100,
  maximumStockLevel: 50, // max < min
  managedBy: '',
  autoReorderEnabled: false
};
testSchema(validations.CreateBufferStockInputSchema, validBufferStock, invalidBufferStock, 'CreateBufferStockInputSchema');

// Example: Replace with your actual Zod schema and test data
const testData = {};

try {
  // Replace 'yourZodSchema' with the actual schema you want to test
  // Example: validations.assetSchema.parse(testData)
  // const result = validations.yourZodSchema.parse(testData);
  // console.log('Validation passed:', result);
  console.log('Add your Zod schema and test data to run this test.');
} catch (e: any) {
  console.error('Validation failed:', e.errors || e);
} 