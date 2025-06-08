// validate-graphql.js
const { buildSchema, validate, parse, printSchema } = require('graphql');
const fs = require('fs');

// Read your GraphQL type definitions
const typeDefs = `
  # Paste your GraphQL schema here or read from file
  # const typeDefs = fs.readFileSync('./schema.graphql', 'utf8');
  
  scalar DateTime
  scalar Decimal
  scalar JSON

  enum AssetStatus {
    ASSIGNED
    IN_MAINTENANCE
    AVAILABLE
    RETIRED
    LOST
  }

  type Asset {
    assetId: ID!
    type: String!
    model: String!
    serialNumber: String!
    status: AssetStatus!
    location: String!
    purchaseDate: DateTime!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    asset(assetId: ID!): Asset
    assets: [Asset!]!
  }

  type Mutation {
    createAsset(type: String!, model: String!, serialNumber: String!): Asset!
  }
`;

function validateGraphQLSchema() {
  try {
    console.log('🔍 Validating GraphQL Schema...\n');

    // Test 1: Build the schema
    console.log('1. Building GraphQL schema...');
    const schema = buildSchema(typeDefs);
    console.log('✅ Schema built successfully');

    // Test 2: Print schema to see the final result
    console.log('\n2. Schema structure:');
    console.log('✅ Schema types found:');
    const typeMap = schema.getTypeMap();
    Object.keys(typeMap)
      .filter(typeName => !typeName.startsWith('__'))
      .forEach(typeName => {
        console.log(`   - ${typeName}`);
      });

    // Test 3: Test query parsing
    console.log('\n3. Testing query parsing...');
    const testQuery = `
      query GetAsset($id: ID!) {
        asset(assetId: $id) {
          assetId
          type
          model
          serialNumber
          status
          location
          purchaseDate
        }
      }
    `;
    
    const parsedQuery = parse(testQuery);
    const validationErrors = validate(schema, parsedQuery);
    
    if (validationErrors.length === 0) {
      console.log('✅ Test query is valid');
    } else {
      console.log('❌ Query validation errors:', validationErrors);
    }

    // Test 4: Test mutation parsing
    console.log('\n4. Testing mutation parsing...');
    const testMutation = `
      mutation CreateAsset($type: String!, $model: String!, $serialNumber: String!) {
        createAsset(type: $type, model: $model, serialNumber: $serialNumber) {
          assetId
          type
          model
          serialNumber
          status
        }
      }
    `;
    
    const parsedMutation = parse(testMutation);
    const mutationValidationErrors = validate(schema, parsedMutation);
    
    if (mutationValidationErrors.length === 0) {
      console.log('✅ Test mutation is valid');
    } else {
      console.log('❌ Mutation validation errors:', mutationValidationErrors);
    }

    console.log('\n🎉 GraphQL schema validation completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ GraphQL schema validation failed:', error.message);
    return false;
  }
}

// Advanced validation with Apollo tools
async function validateWithApollo() {
  try {
    const { makeExecutableSchema } = require('@graphql-tools/schema');
    
    console.log('\n🔍 Advanced validation with Apollo tools...');
    
    // Mock resolvers for testing
    const resolvers = {
      Query: {
        asset: () => null,
        assets: () => []
      },
      Mutation: {
        createAsset: () => null
      },
      DateTime: {
        // Custom scalar resolver would go here
      },
      Decimal: {
        // Custom scalar resolver would go here
      },
      JSON: {
        // Custom scalar resolver would go here
      }
    };

    const executableSchema = makeExecutableSchema({
      typeDefs,
      resolvers
    });

    console.log('✅ Executable schema created successfully');
    return true;

  } catch (error) {
    console.error('❌ Apollo validation failed:', error.message);
    return false;
  }
}

// Run validations
async function runAllValidations() {
  console.log('🚀 Starting GraphQL validation tests...\n');
  
  const basicValidation = validateGraphQLSchema();
  
  if (basicValidation) {
    await validateWithApollo();
  }
  
  console.log('\n📋 Validation Summary:');
  console.log('- Basic schema validation: ' + (basicValidation ? '✅ PASSED' : '❌ FAILED'));
}

runAllValidations();