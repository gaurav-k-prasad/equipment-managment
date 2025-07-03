// Asset Management System GraphQL Resolvers with Prisma ORM
const { PubSub } = require('graphql-subscriptions');
const { GraphQLError } = require('graphql');
const { 
  CreateEmployeeInputSchema, 
  CreateAssetInputSchema, 
  CreateBufferStockInputSchema, 
  CreateProcurementRequestInputSchema, 
  CreateSupplierInputSchema, 
  CreateQuotationInputSchema, 
  CreateAssetAssignmentInputSchema, 
  CreateServiceVendorInputSchema, 
  CreateRepairServiceInputSchema 
} = require('../lib/validations');

const pubsub = new PubSub();

// Subscription event constants
const EVENTS = {
  LOW_STOCK_ALERT: 'LOW_STOCK_ALERT',
  NEW_PROCUREMENT_REQUEST: 'NEW_PROCUREMENT_REQUEST',
  ASSET_ASSIGNMENT_UPDATE: 'ASSET_ASSIGNMENT_UPDATE',
  SERVICE_STATUS_UPDATE: 'SERVICE_STATUS_UPDATE',
  QUOTATION_RECEIVED: 'QUOTATION_RECEIVED'
};

const resolvers = {
  // Scalar resolvers
  Date: require('graphql-iso-date').GraphQLDate,
  DateTime: require('graphql-iso-date').GraphQLDateTime,

  // Query resolvers
  Query: {
    // Employee queries
    employee: async (parent, { id }, { prisma }) => {
      const employee = await prisma.employee.findUnique({
        where: { employeeId: id },
        include: {
          equipmentManager: true
        }
      });
      
      if (!employee) {
        throw new GraphQLError('Employee not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }
      
      return employee;
    },

    employees: async (parent: any, { filter, limit = 50, offset = 0 }: any, { prisma }: any) => {
      const where: any = {};
      
      if (filter?.department) where.department = filter.department;
      if (filter?.position) where.position = filter.position;
      if (filter?.isActive !== undefined) where.isActive = filter.isActive;

      return await prisma.employee.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { lastName: 'asc' }
      });
    },

    // Asset queries
    asset: async (parent: any, { id }: any, { prisma }: any) => {
      const asset = await prisma.asset.findUnique({
        where: { assetId: id },
        include: {
          supplier: true,
          primaryCustodian: true
        }
      });
      
      if (!asset) {
        throw new GraphQLError('Asset not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }
      
      return asset;
    },

    assets: async (parent: any, { filter, sort, limit = 50, offset = 0 }: any, { prisma }: any) => {
      const where: any = {};
      
      if (filter?.assetType) where.assetType = filter.assetType;
      if (filter?.status) where.status = filter.status;
      if (filter?.supplierId) where.supplierId = filter.supplierId;
      if (filter?.employeeId) where.employeeId = filter.employeeId;
      if (filter?.location) where.location = { contains: filter.location, mode: 'insensitive' };

      const orderBy: any = {};
      if (sort?.field) {
        orderBy[sort.field] = sort.order.toLowerCase();
      } else {
        orderBy.assetName = 'asc';
      }

      return await prisma.asset.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          supplier: true,
          primaryCustodian: true
        }
      });
    },

    availableAssets: async (parent: any, { assetType }: any, { prisma }: any) => {
      const where: any = { status: 'AVAILABLE' };
      if (assetType) where.assetType = assetType;

      return await prisma.asset.findMany({
        where,
        include: {
          supplier: true,
          primaryCustodian: true
        }
      });
    },

    // Procurement queries
    procurementRequest: async (parent: any, { id }: any, { prisma }: any) => {
      const request = await prisma.procurementRequest.findUnique({
        where: { requestId: id },
        include: {
          requestedBy: true,
          approvedBy: true,
          bufferStock: true
        }
      });
      
      if (!request) {
        throw new GraphQLError('Procurement request not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }
      
      return request;
    },

    procurementRequests: async (parent: any, { filter, limit = 50, offset = 0 }: any, { prisma }: any) => {
      const where: any = {};
      
      if (filter?.status) where.status = filter.status;
      if (filter?.requestType) where.requestType = filter.requestType;
      if (filter?.requestedBy) where.requestedBy = filter.requestedBy;
      if (filter?.approvedBy) where.approvedBy = filter.approvedBy;

      return await prisma.procurementRequest.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { requestDate: 'desc' },
        include: {
          requestedBy: true,
          approvedBy: true,
          bufferStock: true
        }
      });
    },

    pendingRequests: async (parent: any, args: any, { prisma }: any) => {
      return await prisma.procurementRequest.findMany({
        where: { status: 'PENDING' },
        orderBy: { requestDate: 'asc' },
        include: {
          requestedBy: true,
          bufferStock: true
        }
      });
    },

    // Supplier queries
    supplier: async (parent: any, { id }: any, { prisma }: any) => {
      const supplier = await prisma.supplier.findUnique({
        where: { supplierId: id }
      });
      
      if (!supplier) {
        throw new GraphQLError('Supplier not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }
      
      return supplier;
    },

    suppliers: async (parent: any, { isActive, limit = 50, offset = 0 }: any, { prisma }: any) => {
      const where: any = {};
      if (isActive !== undefined) where.isActive = isActive;

      return await prisma.supplier.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { supplierName: 'asc' }
      });
    },

    // Buffer Stock queries
    bufferStock: async (parent: any, { id }: any, { prisma }: any) => {
      const bufferStock = await prisma.bufferStock.findUnique({
        where: { stockId: id },
        include: {
          preferredSupplier: true,
          managedBy: true
        }
      });
      
      if (!bufferStock) {
        throw new GraphQLError('Buffer stock not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }
      
      return bufferStock;
    },

    bufferStocks: async (parent: any, { filter, limit = 50, offset = 0 }: any, { prisma }: any) => {
      const where: any = {};
      
      if (filter?.itemType) where.itemType = filter.itemType;
      if (filter?.managedBy) where.managedBy = filter.managedBy;
      if (filter?.belowMinimum) {
        where.quantityAvailable = { lte: prisma.raw('minimum_stock_level') };
      }

      return await prisma.bufferStock.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { itemName: 'asc' },
        include: {
          preferredSupplier: true,
          managedBy: true
        }
      });
    },

    lowStockItems: async (parent: any, args: any, { prisma }: any) => {
      return await prisma.bufferStock.findMany({
        where: {
          quantityAvailable: { lte: prisma.raw('minimum_stock_level') }
        },
        include: {
          preferredSupplier: true,
          managedBy: true
        }
      });
    },

    // Service queries
    serviceVendor: async (parent: any, { id }: any, { prisma }: any) => {
      const vendor = await prisma.serviceVendor.findUnique({
        where: { vendorId: id }
      });
      
      if (!vendor) {
        throw new GraphQLError('Service vendor not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }
      
      return vendor;
    },

    serviceVendors: async (parent: any, { specialization, isActive }: any, { prisma }: any) => {
      const where: any = {};
      
      if (specialization) where.specialization = { contains: specialization, mode: 'insensitive' };
      if (isActive !== undefined) where.isActive = isActive;

      return await prisma.serviceVendor.findMany({
        where,
        orderBy: { vendorName: 'asc' }
      });
    },

    repairService: async (parent: any, { id }: any, { prisma }: any) => {
      const service = await prisma.repairService.findUnique({
        where: { serviceId: id },
        include: {
          asset: true,
          vendor: true,
          requestedBy: true
        }
      });
      
      if (!service) {
        throw new GraphQLError('Repair service not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }
      
      return service;
    },

    repairServices: async (parent: any, { assetId, status, limit = 50, offset = 0 }: any, { prisma }: any) => {
      const where: any = {};
      
      if (assetId) where.assetId = assetId;
      if (status) where.status = status;

      return await prisma.repairService.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { serviceDate: 'desc' },
        include: {
          asset: true,
          vendor: true,
          requestedBy: true
        }
      });
    },

    // Assignment queries
    assetAssignment: async (parent: any, { id }: any, { prisma }: any) => {
      const assignment = await prisma.assetAssignment.findUnique({
        where: { assignmentId: id },
        include: {
          asset: true,
          employee: true,
          assignedBy: true
        }
      });
      
      if (!assignment) {
        throw new GraphQLError('Asset assignment not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }
      
      return assignment;
    },

    assetAssignments: async (parent: any, { employeeId, assetId, status }: any, { prisma }: any) => {
      const where: any = {};
      
      if (employeeId) where.employeeId = employeeId;
      if (assetId) where.assetId = assetId;
      if (status) where.assignmentStatus = status;

      return await prisma.assetAssignment.findMany({
        where,
        orderBy: { assignedDate: 'desc' },
        include: {
          asset: true,
          employee: true,
          assignedBy: true
        }
      });
    },

    overdueAssignments: async (parent: any, args: any, { prisma }: any) => {
      const today = new Date();
      
      return await prisma.assetAssignment.findMany({
        where: {
          assignmentStatus: 'ACTIVE',
          returnDate: { lt: today }
        },
        include: {
          asset: true,
          employee: true,
          assignedBy: true
        }
      });
    },

    // Analytics queries
    assetUtilizationReport: async (parent: any, { department, dateFrom, dateTo }: any, { prisma }: any) => {
      // Complex aggregation query for asset utilization
      const result = await prisma.$queryRaw`
        SELECT 
          a.asset_type,
          COUNT(DISTINCT a.asset_id) as total_assets,
          COUNT(DISTINCT CASE WHEN aa.assignment_status = 'ACTIVE' THEN aa.asset_id END) as assigned_assets,
          e.department
        FROM assets a
        LEFT JOIN asset_assignments aa ON a.asset_id = aa.asset_id
        LEFT JOIN employees e ON a.employee_id = e.employee_id
        WHERE (${department}::text IS NULL OR e.department = ${department})
        AND (${dateFrom}::date IS NULL OR aa.assigned_date >= ${dateFrom})
        AND (${dateTo}::date IS NULL OR aa.assigned_date <= ${dateTo})
        GROUP BY a.asset_type, e.department
      `;

      return result.map((row: any) => ({
        assetType: row.asset_type,
        totalAssets: parseInt(row.total_assets),
        assignedAssets: parseInt(row.assigned_assets),
        utilizationRate: row.total_assets > 0 ? (row.assigned_assets / row.total_assets) * 100 : 0,
        department: row.department
      }));
    },

    procurementSpendingReport: async (parent: any, { dateFrom, dateTo }: any, { prisma }: any) => {
      const result = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', pr.request_date) as month,
          SUM(pr.estimated_cost) as total_spending,
          COUNT(*) as request_count,
          AVG(pr.estimated_cost) as average_request_value,
          MODE() WITHIN GROUP (ORDER BY a.asset_type) as top_category
        FROM procurement_requests pr
        LEFT JOIN assets a ON pr.request_id = a.asset_id
        WHERE pr.status = 'COMPLETED'
        AND (${dateFrom}::date IS NULL OR pr.request_date >= ${dateFrom})
        AND (${dateTo}::date IS NULL OR pr.request_date <= ${dateTo})
        GROUP BY DATE_TRUNC('month', pr.request_date)
        ORDER BY month DESC
      `;

      return result.map((row: any) => ({
        month: row.month.toISOString().substring(0, 7),
        totalSpending: parseFloat(row.total_spending) || 0,
        requestCount: parseInt(row.request_count),
        averageRequestValue: parseFloat(row.average_request_value) || 0,
        topCategory: row.top_category || 'Unknown'
      }));
    },

    bufferConsumptionReport: async (parent: any, { stockId, dateFrom, dateTo }: any, { prisma }: any) => {
      const consumptions = await prisma.bufferConsumption.findMany({
        where: {
          ...(stockId && { stockId }),
          consumptionDate: {
            ...(dateFrom && { gte: dateFrom }),
            ...(dateTo && { lte: dateTo })
          }
        },
        include: {
          bufferStock: true,
          employee: true
        }
      });

      // Group by item and calculate statistics
      const grouped = consumptions.reduce((acc: any, consumption: any) => {
        const key = consumption.bufferStock.itemName;
        if (!acc[key]) {
          acc[key] = {
            itemName: key,
            totalConsumed: 0,
            consumptionsByDepartment: {},
            records: []
          };
        }
        
        acc[key].totalConsumed += consumption.quantityConsumed;
        acc[key].records.push(consumption);
        
        const dept = consumption.employee.department;
        if (!acc[key].consumptionsByDepartment[dept]) {
          acc[key].consumptionsByDepartment[dept] = 0;
        }
        acc[key].consumptionsByDepartment[dept] += consumption.quantityConsumed;
        
        return acc;
      }, {} as Record<string, {
        itemName: string;
        totalConsumed: number;
        consumptionsByDepartment: Record<string, number>;
        records: any[];
      }>);

      return Object.values(grouped).map(item => {
        const typedItem = item as {
          itemName: string;
          totalConsumed: number;
          consumptionsByDepartment: Record<string, number>;
          records: any[];
        };
        return {
          itemName: typedItem.itemName,
          totalConsumed: typedItem.totalConsumed,
          consumptionsByDepartment: Object.entries(typedItem.consumptionsByDepartment).map(([dept, qty]) => ({
            department: dept,
            quantity: qty,
            percentage: (qty / typedItem.totalConsumed) * 100
          })),
          averageMonthlyConsumption: typedItem.totalConsumed / Math.max(1, typedItem.records.length)
        };
      });
    }
  },

  // Mutation resolvers
  Mutation: {
    // Employee mutations
    createEmployee: async (parent: any, { input }: any, { prisma, user }: any) => {
      CreateEmployeeInputSchema.parse(input);
      return await prisma.employee.create({
        data: {
          ...input,
          isActive: true
        }
      });
    },

    updateEmployee: async (parent: any, { id, input }: any, { prisma, user }: any) => {
      CreateEmployeeInputSchema.partial().parse(input);
      try {
        return await prisma.employee.update({
          where: { employeeId: id },
          data: input
        });
      } catch (error: any) {
        if (error.code === 'P2025') {
          throw new GraphQLError('Employee not found', {
            extensions: { code: 'NOT_FOUND' }
          });
        }
        throw error;
      }
    },

    deactivateEmployee: async (parent: any, { id }: any, { prisma, user }: any) => {
      return await prisma.employee.update({
        where: { employeeId: id },
        data: { isActive: false }
      });
    },

    // Asset mutations
    createAsset: async (parent: any, { input }: any, { prisma, user }: any) => {
      CreateAssetInputSchema.parse(input);
      return await prisma.asset.create({
        data: {
          ...input,
          status: 'AVAILABLE'
        },
        include: {
          supplier: true,
          primaryCustodian: true
        }
      });
    },

    updateAsset: async (parent: any, { id, input }: any, { prisma, user }: any) => {
      CreateAssetInputSchema.partial().parse(input);
      return await prisma.asset.update({
        where: { assetId: id },
        data: input,
        include: {
          supplier: true,
          primaryCustodian: true
        }
      });
    },

    disposeAsset: async (parent: any, { id, reason }: any, { prisma, user }: any) => {
      // First check if asset has active assignments
      const activeAssignments = await prisma.assetAssignment.findMany({
        where: {
          assetId: id,
          assignmentStatus: 'ACTIVE'
        }
      });

      if (activeAssignments.length > 0) {
        throw new GraphQLError('Cannot dispose asset with active assignments', {
          extensions: { code: 'BUSINESS_RULE_VIOLATION' }
        });
      }

      return await prisma.asset.update({
        where: { assetId: id },
        data: { 
          status: 'DISPOSED',
          // You might want to add a disposal reason field to your schema
        },
        include: {
          supplier: true,
          primaryCustodian: true
        }
      });
    },

    // Procurement mutations
    createProcurementRequest: async (parent: any, { input }: any, { prisma, user }: any) => {
      CreateProcurementRequestInputSchema.parse(input);
      const request = await prisma.procurementRequest.create({
        data: {
          ...input,
          requestedBy: user.employeeId,
          requestDate: new Date(),
          status: 'PENDING'
        },
        include: {
          requestedBy: true,
          bufferStock: true
        }
      });
      pubsub.publish(EVENTS.NEW_PROCUREMENT_REQUEST, {
        newProcurementRequest: request
      });
      return request;
    },

    approveProcurementRequest: async (parent: any, { id, approverId }: any, { prisma, user }: any) => {
      const request = await prisma.procurementRequest.update({
        where: { requestId: id },
        data: {
          status: 'APPROVED',
          approvedBy: approverId,
          approvedDate: new Date()
        },
        include: {
          requestedBy: true,
          approvedBy: true,
          bufferStock: true
        }
      });

      return request;
    },

    rejectProcurementRequest: async (parent: any, { id, approverId, reason }: any, { prisma, user }: any) => {
      return await prisma.procurementRequest.update({
        where: { requestId: id },
        data: {
          status: 'REJECTED',
          approvedBy: approverId,
          approvedDate: new Date()
          // You might want to add a rejection reason field
        },
        include: {
          requestedBy: true,
          approvedBy: true,
          bufferStock: true
        }
      });
    },

    completeProcurementRequest: async (parent: any, { id }: any, { prisma, user }: any) => {
      return await prisma.procurementRequest.update({
        where: { requestId: id },
        data: { status: 'COMPLETED' },
        include: {
          requestedBy: true,
          approvedBy: true,
          bufferStock: true
        }
      });
    },

    // Supplier mutations
    createSupplier: async (parent: any, { input }: any, { prisma, user }: any) => {
      CreateSupplierInputSchema.parse(input);
      return await prisma.supplier.create({
        data: {
          ...input,
          isActive: true
        }
      });
    },

    updateSupplier: async (parent: any, { id, input }: any, { prisma, user }: any) => {
      CreateSupplierInputSchema.partial().parse(input);
      return await prisma.supplier.update({
        where: { supplierId: id },
        data: input
      });
    },

    deactivateSupplier: async (parent: any, { id }: any, { prisma, user }: any) => {
      return await prisma.supplier.update({
        where: { supplierId: id },
        data: { isActive: false }
      });
    },

    // Quotation mutations
    createQuotation: async (parent: any, { input }: any, { prisma, user }: any) => {
      CreateQuotationInputSchema.parse(input);
      const quotation = await prisma.quotation.create({
        data: {
          ...input,
          quotationDate: new Date(),
          isSelected: false
        },
        include: {
          supplier: true,
          procurementRequest: true
        }
      });
      pubsub.publish(EVENTS.QUOTATION_RECEIVED, {
        quotationReceived: quotation
      });
      return quotation;
    },

    selectQuotation: async (parent: any, { id }: any, { prisma, user }: any) => {
      // First, unselect all quotations for the same request
      const quotation = await prisma.quotation.findUnique({
        where: { quotationId: id }
      });

      await prisma.quotation.updateMany({
        where: { requestId: quotation.requestId },
        data: { isSelected: false }
      });

      // Then select the chosen quotation
      return await prisma.quotation.update({
        where: { quotationId: id },
        data: { isSelected: true },
        include: {
          supplier: true,
          procurementRequest: true
        }
      });
    },

    // Buffer Stock mutations
    createBufferStock: async (parent: any, { input }: any, { prisma, user }: any) => {
      CreateBufferStockInputSchema.parse(input);
      return await prisma.bufferStock.create({
        data: {
          ...input,
          lastUpdated: new Date()
        },
        include: {
          preferredSupplier: true,
          managedBy: true
        }
      });
    },

    updateBufferStockQuantity: async (parent: any, { id, quantity }: any, { prisma, user }: any) => {
      const bufferStock = await prisma.bufferStock.update({
        where: { stockId: id },
        data: { 
          quantityAvailable: quantity,
          lastUpdated: new Date()
        },
        include: {
          preferredSupplier: true,
          managedBy: true
        }
      });
      
      // Check if stock is low and trigger alert
      if (bufferStock.quantityAvailable <= bufferStock.minimumStockLevel) {
        pubsub.publish(EVENTS.LOW_STOCK_ALERT, {
          lowStockAlert: bufferStock
        });

        // Auto-generate procurement request if enabled
        if (bufferStock.autoReorderEnabled) {
          const reorderQuantity = bufferStock.maximumStockLevel - bufferStock.quantityAvailable;
          
          await prisma.procurementRequest.create({
            data: {
              itemDescription: `Auto-reorder: ${bufferStock.itemName}`,
              quantity: reorderQuantity,
              specifications: bufferStock.specifications,
              requestType: 'BUFFER_STOCK',
              bufferStockId: bufferStock.stockId,
              requestedBy: bufferStock.managedBy.employeeId,
              requestDate: new Date(),
              status: 'PENDING',
              justification: 'Automatic reorder due to low stock level'
            }
          });
        }
      }

      return bufferStock;
    },

    recordBufferConsumption: async (parent: any, { input }: any, { prisma, user }: any) => {
      return await prisma.$transaction(async (tx: any) => {
        // Record consumption
        const consumption = await tx.bufferConsumption.create({
          data: {
            ...input,
            employeeId: user.employeeId,
            consumptionDate: new Date(),
            status: 'PENDING'
          },
          include: {
            bufferStock: true,
            employee: true
          }
        });

        // Update buffer stock quantity
        await tx.bufferStock.update({
          where: { stockId: input.stockId },
          data: {
            quantityAvailable: { decrement: input.quantityConsumed },
            lastUpdated: new Date()
          }
        });

        return consumption;
      });
    },

    approveBufferConsumption: async (parent: any, { id, approverId }: any, { prisma, user }: any) => {
      return await prisma.bufferConsumption.update({
        where: { consumptionId: id },
        data: {
          status: 'APPROVED',
          approvedBy: approverId
        },
        include: {
          bufferStock: true,
          employee: true,
          approvedBy: true
        }
      });
    },

    // Asset Assignment mutations
    assignAsset: async (parent: any, { input }: any, { prisma, user }: any) => {
      CreateAssetAssignmentInputSchema.parse(input);
      return await prisma.$transaction(async (tx: any) => {
        // Check if asset is available
        const asset = await tx.asset.findUnique({
          where: { assetId: input.assetId }
        });

        if (asset.status !== 'AVAILABLE') {
          throw new GraphQLError('Asset is not available for assignment', {
            extensions: { code: 'BUSINESS_RULE_VIOLATION' }
          });
        }

        // Create assignment
        const assignment = await tx.assetAssignment.create({
          data: {
            ...input,
            assignedDate: new Date(),
            assignmentStatus: 'ACTIVE',
            assignedBy: user.employeeId
          },
          include: {
            asset: true,
            employee: true,
            assignedBy: true
          }
        });

        // Update asset status
        await tx.asset.update({
          where: { assetId: input.assetId },
          data: { 
            status: 'ASSIGNED',
            employeeId: input.employeeId
          }
        });

        // Publish subscription event
        pubsub.publish(EVENTS.ASSET_ASSIGNMENT_UPDATE, {
          assetAssignmentUpdate: assignment
        });

        return assignment;
      });
    },

    returnAsset: async (parent: any, { assignmentId, conditionAtReturn }: any, { prisma, user }: any) => {
      return await prisma.$transaction(async (tx: any) => {
        const assignment = await tx.assetAssignment.update({
          where: { assignmentId },
          data: {
            returnDate: new Date(),
            conditionAtReturn,
            assignmentStatus: 'RETURNED'
          },
          include: {
            asset: true,
            employee: true,
            assignedBy: true
          }
        });

        // Update asset status to available
        await tx.asset.update({
          where: { assetId: assignment.asset.assetId },
          data: { 
            status: 'AVAILABLE',
            employeeId: null
          }
        });

        // Publish subscription event
        pubsub.publish(EVENTS.ASSET_ASSIGNMENT_UPDATE, {
          assetAssignmentUpdate: assignment
        });

        return assignment;
      });
    },

    // Service mutations
    createServiceVendor: async (parent: any, { input }: any, { prisma, user }: any) => {
      CreateServiceVendorInputSchema.parse(input);
      return await prisma.serviceVendor.create({
        data: {
          ...input,
          isActive: true
        }
      });
    },

    scheduleRepairService: async (parent: any, { input }: any, { prisma, user }: any) => {
      CreateRepairServiceInputSchema.parse(input);
      return await prisma.$transaction(async (tx: any) => {
        const service = await tx.repairService.create({
          data: {
            ...input,
            serviceDate: new Date(),
            requestedBy: user.employeeId,
            status: 'SCHEDULED'
          },
          include: {
            asset: true,
            vendor: true,
            requestedBy: true
          }
        });

        // Update asset status
        await tx.asset.update({
          where: { assetId: input.assetId },
          data: { status: 'UNDER_MAINTENANCE' }
        });

        return service;
      });
    },

    completeRepairService: async (parent: any, { id, completionDate, warrantyPeriod }: any, { prisma, user }: any) => {
      return await prisma.$transaction(async (tx: any) => {
        const service = await tx.repairService.update({
          where: { serviceId: id },
          data: {
            completionDate,
            warrantyPeriod,
            status: 'COMPLETED'
          },
          include: {
            asset: true,
            vendor: true,
            requestedBy: true
          }
        });

        // Check if asset has active assignment to determine new status
        const activeAssignment = await tx.assetAssignment.findFirst({
          where: {
            assetId: service.asset.assetId,
            assignmentStatus: 'ACTIVE'
          }
        });

        const newStatus = activeAssignment ? 'ASSIGNED' : 'AVAILABLE';
        
        await tx.asset.update({
          where: { assetId: service.asset.assetId },
          data: { status: newStatus }
        });

        // Publish subscription event
        pubsub.publish(EVENTS.SERVICE_STATUS_UPDATE, {
          serviceStatusUpdate: service
        });

        return service;
      });
    },

    // Equipment Manager mutations
    assignEquipmentManager: async (parent: any, { employeeId, department }: any, { prisma, user }: any) => {
      return await prisma.equipmentManager.create({
        data: {
          employeeId,
          department,
          assignedDate: new Date(),
          isActive: true
        },
        include: {
          employee: true
        }
      });
    },

    removeEquipmentManager: async (parent: any, { managerId }: any, { prisma, user }: any) => {
      await prisma.equipmentManager.update({
        where: { managerId },
        data: { isActive: false }
      });
      return true;
    }
  },

  // Subscription resolvers
  Subscription: {
    lowStockAlert: {
      subscribe: () => pubsub.asyncIterator([EVENTS.LOW_STOCK_ALERT])
    },

    newProcurementRequest: {
      subscribe: () => pubsub.asyncIterator([EVENTS.NEW_PROCUREMENT_REQUEST])
    },

    assetAssignmentUpdate: {
      subscribe: () => pubsub.asyncIterator([EVENTS.ASSET_ASSIGNMENT_UPDATE])
    },

    serviceStatusUpdate: {
      subscribe: () => pubsub.asyncIterator([EVENTS.SERVICE_STATUS_UPDATE])
    },

    quotationReceived: {
      subscribe: () => pubsub.asyncIterator([EVENTS.QUOTATION_RECEIVED])
    }
  }
};

module.exports = resolvers;