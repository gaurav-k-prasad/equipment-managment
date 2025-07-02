// Asset Management System Zod Validation Functions
const { z } = require('zod');

// Custom validators
const emailValidator = z.string().email('Invalid email format');
const phoneValidator = z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format').optional();
const positiveFloat = z.number().positive('Must be a positive number');
const positiveInt = z.number().int().positive('Must be a positive integer');
const nonNegativeInt = z.number().int().min(0, 'Must be non-negative');
const nonEmptyString = z.string().min(1, 'Cannot be empty');
const idValidator = z.string().min(1, 'ID cannot be empty');

// Date validators
const pastDate = z.date().max(new Date(), 'Date cannot be in the future');
const futureDate = z.date().min(new Date(), 'Date cannot be in the past');
const dateValidator = z.date();

// Enum validators
const AssetStatusSchema = z.enum(['AVAILABLE', 'ASSIGNED', 'UNDER_MAINTENANCE', 'DISPOSED']);
const RequestStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']);
const RequestTypeSchema = z.enum(['ASSET', 'BUFFER_STOCK', 'SERVICE']);
const AssignmentStatusSchema = z.enum(['ACTIVE', 'RETURNED', 'OVERDUE']);
const ServiceTypeSchema = z.enum(['REPAIR', 'MAINTENANCE', 'INSPECTION']);
const ServiceStatusSchema = z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED']);
const ConsumptionStatusSchema = z.enum(['PENDING', 'APPROVED', 'COMPLETED']);
const SortOrderSchema = z.enum(['ASC', 'DESC']);

// Employee Validation Schemas
const CreateEmployeeInputSchema = z.object({
  firstName: nonEmptyString.max(50, 'First name must be 50 characters or less'),
  lastName: nonEmptyString.max(50, 'Last name must be 50 characters or less'),
  department: nonEmptyString.max(100, 'Department must be 100 characters or less'),
  position: nonEmptyString.max(100, 'Position must be 100 characters or less'),
  email: emailValidator,
  phone: phoneValidator,
  hireDate: pastDate
});

const UpdateEmployeeInputSchema = z.object({
  firstName: z.string().max(50, 'First name must be 50 characters or less').optional(),
  lastName: z.string().max(50, 'Last name must be 50 characters or less').optional(),
  department: z.string().max(100, 'Department must be 100 characters or less').optional(),
  position: z.string().max(100, 'Position must be 100 characters or less').optional(),
  email: emailValidator.optional(),
  phone: phoneValidator,
  isActive: z.boolean().optional()
});

const EmployeeFilterSchema = z.object({
  department: z.string().optional(),
  position: z.string().optional(),
  isActive: z.boolean().optional()
}).optional();

// Asset Validation Schemas
const CreateAssetInputSchema = z.object({
  assetName: nonEmptyString.max(200, 'Asset name must be 200 characters or less'),
  assetType: nonEmptyString.max(100, 'Asset type must be 100 characters or less'),
  model: z.string().max(100, 'Model must be 100 characters or less').optional(),
  serialNumber: z.string().max(100, 'Serial number must be 100 characters or less').optional(),
  purchasePrice: positiveFloat.optional(),
  purchaseDate: pastDate.optional(),
  warrantyExpiry: z.date().optional(),
  specifications: z.string().max(1000, 'Specifications must be 1000 characters or less').optional(),
  location: z.string().max(200, 'Location must be 200 characters or less').optional(),
  supplierId: idValidator.optional(),
  employeeId: idValidator.optional()
}).refine(data => {
  // If purchase date is provided and warranty expiry is provided, warranty should be after purchase
  if (data.purchaseDate && data.warrantyExpiry) {
    return data.warrantyExpiry > data.purchaseDate;
  }
  return true;
}, {
  message: 'Warranty expiry date must be after purchase date',
  path: ['warrantyExpiry']
});

const UpdateAssetInputSchema = z.object({
  assetName: z.string().max(200, 'Asset name must be 200 characters or less').optional(),
  assetType: z.string().max(100, 'Asset type must be 100 characters or less').optional(),
  model: z.string().max(100, 'Model must be 100 characters or less').optional(),
  serialNumber: z.string().max(100, 'Serial number must be 100 characters or less').optional(),
  status: AssetStatusSchema.optional(),
  specifications: z.string().max(1000, 'Specifications must be 1000 characters or less').optional(),
  location: z.string().max(200, 'Location must be 200 characters or less').optional(),
  employeeId: idValidator.optional()
});

const AssetSortSchema = z.object({
  field: nonEmptyString,
  order: SortOrderSchema
}).optional();

const AssetFilterSchema = z.object({
  assetType: z.string().optional(),
  status: AssetStatusSchema.optional(),
  supplierId: idValidator.optional(),
  employeeId: idValidator.optional(),
  location: z.string().optional()
}).optional();

// Procurement Validation Schemas
const CreateProcurementRequestInputSchema = z.object({
  itemDescription: nonEmptyString.max(500, 'Item description must be 500 characters or less'),
  quantity: positiveInt.max(10000, 'Quantity cannot exceed 10,000'),
  specifications: z.string().max(1000, 'Specifications must be 1000 characters or less').optional(),
  estimatedCost: positiveFloat.optional(),
  justification: z.string().max(500, 'Justification must be 500 characters or less').optional(),
  requestType: RequestTypeSchema,
  bufferStockId: idValidator.optional()
}).refine(data => {
  // If request type is BUFFER_STOCK, bufferStockId is required
  if (data.requestType === 'BUFFER_STOCK') {
    return !!data.bufferStockId;
  }
  return true;
}, {
  message: 'Buffer stock ID is required for buffer stock requests',
  path: ['bufferStockId']
});

const ProcurementRequestFilterSchema = z.object({
  status: RequestStatusSchema.optional(),
  requestType: RequestTypeSchema.optional(),
  requestedBy: idValidator.optional(),
  approvedBy: idValidator.optional()
}).optional();

// Supplier Validation Schemas
const CreateSupplierInputSchema = z.object({
  supplierName: nonEmptyString.max(200, 'Supplier name must be 200 characters or less'),
  contactPerson: z.string().max(100, 'Contact person must be 100 characters or less').optional(),
  email: emailValidator.optional(),
  phone: phoneValidator,
  address: z.string().max(300, 'Address must be 300 characters or less').optional(),
  city: z.string().max(100, 'City must be 100 characters or less').optional(),
  country: z.string().max(100, 'Country must be 100 characters or less').optional(),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5').optional()
});

// Quotation Validation Schemas
const CreateQuotationInputSchema = z.object({
  supplierId: idValidator,
  requestId: idValidator,
  itemDescription: nonEmptyString.max(500, 'Item description must be 500 characters or less'),
  quotedPrice: positiveFloat,
  quantity: positiveInt,
  validUntil: futureDate.optional(),
  terms: z.string().max(1000, 'Terms must be 1000 characters or less').optional(),
  specifications: z.string().max(1000, 'Specifications must be 1000 characters or less').optional()
});

// Buffer Stock Validation Schemas
const CreateBufferStockInputSchema = z.object({
  itemName: nonEmptyString.max(200, 'Item name must be 200 characters or less'),
  itemType: nonEmptyString.max(100, 'Item type must be 100 characters or less'),
  quantityAvailable: nonNegativeInt,
  minimumStockLevel: positiveInt,
  maximumStockLevel: positiveInt,
  specifications: z.string().max(1000, 'Specifications must be 1000 characters or less').optional(),
  storageLocation: z.string().max(200, 'Storage location must be 200 characters or less').optional(),
  unitCost: positiveFloat.optional(),
  autoReorderEnabled: z.boolean().default(false),
  preferredSupplierId: idValidator.optional(),
  managedBy: idValidator
}).refine(data => data.maximumStockLevel > data.minimumStockLevel, {
  message: 'Maximum stock level must be greater than minimum stock level',
  path: ['maximumStockLevel']
}).refine(data => data.quantityAvailable <= data.maximumStockLevel, {
  message: 'Available quantity cannot exceed maximum stock level',
  path: ['quantityAvailable']
});

const BufferStockFilterSchema = z.object({
  itemType: z.string().optional(),
  belowMinimum: z.boolean().optional(),
  managedBy: idValidator.optional()
}).optional();

const CreateBufferConsumptionInputSchema = z.object({
  stockId: idValidator,
  quantityConsumed: positiveInt,
  purpose: z.string().max(300, 'Purpose must be 300 characters or less').optional(),
  projectCode: z.string().max(50, 'Project code must be 50 characters or less').optional()
});

// Asset Assignment Validation Schemas
const CreateAssetAssignmentInputSchema = z.object({
  assetId: idValidator,
  employeeId: idValidator,
  conditionAtAssignment: z.string().max(500, 'Condition description must be 500 characters or less').optional(),
  notes: z.string().max(1000, 'Notes must be 1000 characters or less').optional()
});

// Service Vendor Validation Schemas
const CreateServiceVendorInputSchema = z.object({
  vendorName: nonEmptyString.max(200, 'Vendor name must be 200 characters or less'),
  contactPerson: z.string().max(100, 'Contact person must be 100 characters or less').optional(),
  email: emailValidator.optional(),
  phone: phoneValidator,
  address: z.string().max(300, 'Address must be 300 characters or less').optional(),
  specialization: z.string().max(200, 'Specialization must be 200 characters or less').optional(),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5').optional()
});

const CreateRepairServiceInputSchema = z.object({
  assetId: idValidator,
  vendorId: idValidator,
  serviceType: ServiceTypeSchema,
  description: nonEmptyString.max(1000, 'Description must be 1000 characters or less'),
  cost: positiveFloat.optional()
});

// Query Parameter Validation Schemas
const PaginationSchema = z.object({
  limit: z.number().int().min(1).max(1000).default(50),
  offset: z.number().int().min(0).default(0)
});

const DateRangeSchema = z.object({
  dateFrom: z.date().optional(),
  dateTo: z.date().optional()
}).refine(data => {
  if (data.dateFrom && data.dateTo) {
    return data.dateTo >= data.dateFrom;
  }
  return true;
}, {
  message: 'End date must be after or equal to start date',
  path: ['dateTo']
});

// Analytics Validation Schemas
const AssetUtilizationReportSchema = z.object({
  department: z.string().optional(),
  ...DateRangeSchema.shape
});

const ProcurementSpendingReportSchema = DateRangeSchema;

const BufferConsumptionReportSchema = z.object({
  stockId: idValidator.optional(),
  ...DateRangeSchema.shape
});

// Validation middleware functions
const validateInput = (schema) => (input) => {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }));
      
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      validationError.details = formattedErrors;
      throw validationError;
    }
    throw error;
  }
};

// Business rule validators
const businessRuleValidators = {
  // Validate asset assignment business rules
  validateAssetAssignment: async (input, prisma) => {
    const asset = await prisma.asset.findUnique({
      where: { assetId: input.assetId }
    });
    
    if (!asset) {
      throw new Error('Asset not found');
    }
    
    if (asset.status !== 'AVAILABLE') {
      throw new Error('Asset is not available for assignment');
    }
    
    // Check if employee exists and is active
    const employee = await prisma.employee.findUnique({
      where: { employeeId: input.employeeId }
    });
    
    if (!employee || !employee.isActive) {
      throw new Error('Employee not found or inactive');
    }
    
    return true;
  },

  // Validate buffer stock consumption
  validateBufferConsumption: async (input, prisma) => {
    const bufferStock = await prisma.bufferStock.findUnique({
      where: { stockId: input.stockId }
    });
    
    if (!bufferStock) {
      throw new Error('Buffer stock item not found');
    }
    
    if (bufferStock.quantityAvailable < input.quantityConsumed) {
      throw new Error('Insufficient stock available');
    }
    
    return true;
  },

  // Validate procurement approval
  validateProcurementApproval: async (requestId, approverId, prisma) => {
    const request = await prisma.procurementRequest.findUnique({
      where: { requestId },
      include: { requestedBy: true }
    });
    
    if (!request) {
      throw new Error('Procurement request not found');
    }
    
    if (request.status !== 'PENDING') {
      throw new Error('Only pending requests can be approved');
    }
    
    if (request.requestedBy.employeeId === approverId) {
      throw new Error('Cannot approve own request');
    }
    
    return true;
  },

  // Validate asset disposal
  validateAssetDisposal: async (assetId, prisma) => {
    const activeAssignments = await prisma.assetAssignment.count({
      where: {
        assetId,
        assignmentStatus: 'ACTIVE'
      }
    });
    
    if (activeAssignments > 0) {
      throw new Error('Cannot dispose asset with active assignments');
    }
    
    return true;
  },

  // Validate service completion
  validateServiceCompletion: async (serviceId, completionDate, prisma) => {
    const service = await prisma.repairService.findUnique({
      where: { serviceId }
    });
    
    if (!service) {
      throw new Error('Service record not found');
    }
    
    if (service.status === 'COMPLETED') {
      throw new Error('Service is already completed');
    }
    
    if (completionDate < service.serviceDate) {
      throw new Error('Completion date cannot be before service date');
    }
    
    return true;
  }
};

// Export all validation schemas and functions
module.exports = {
  // Validation schemas
  CreateEmployeeInputSchema,
  UpdateEmployeeInputSchema,
  EmployeeFilterSchema,
  CreateAssetInputSchema,
  UpdateAssetInputSchema,
  AssetFilterSchema,
  AssetSortSchema,
  CreateProcurementRequestInputSchema,
  ProcurementRequestFilterSchema,
  CreateSupplierInputSchema,
  CreateQuotationInputSchema,
  CreateBufferStockInputSchema,
  BufferStockFilterSchema,
  CreateBufferConsumptionInputSchema,
  CreateAssetAssignmentInputSchema,
  CreateServiceVendorInputSchema,
  CreateRepairServiceInputSchema,
  PaginationSchema,
  DateRangeSchema,
  AssetUtilizationReportSchema,
  ProcurementSpendingReportSchema,
  BufferConsumptionReportSchema,
  
  // Enum schemas
  AssetStatusSchema,
  RequestStatusSchema,
  RequestTypeSchema,
  AssignmentStatusSchema,
  ServiceTypeSchema,
  ServiceStatusSchema,
  ConsumptionStatusSchema,
  SortOrderSchema,
  
  // Validation middleware
  validateInput,
  
  // Business rule validators
  businessRuleValidators,
  
  // Custom validators
  emailValidator,
  phoneValidator,
  positiveFloat,
  positiveInt,
  nonNegativeInt,
  nonEmptyString,
  idValidator,
  pastDate,
  futureDate,
  dateValidator
};
