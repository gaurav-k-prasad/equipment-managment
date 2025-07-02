// Asset Management System GraphQL Resolvers with Prisma ORM
const { PubSub } = require('graphql-subscriptions');
const { GraphQLError } = require('graphql');

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

    employees: async (parent, { filter, limit = 50, offset = 0 }, { prisma }) => {
      const where = {};
      
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
    asset: async (parent, { id }, { prisma }) => {
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

    assets: async (parent, { filter, sort, limit = 50, offset = 0 }, { prisma }) => {
      const where = {};
      
      if (filter?.assetType) where.assetType = filter.assetType;
      if (filter?.status) where.status = filter.status;
      if (filter?.supplierId) where.supplierId = filter.supplierId;
      if (filter?.employeeId) where.employeeId = filter.employeeId;
      if (filter?.location) where.location = { contains: filter.location, mode: 'insensitive' };

      const orderBy = {};
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

    availableAssets: async (parent, { assetType }, { prisma }) => {
      const where = { status: 'AVAILABLE' };
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
    procurementRequest: async (parent, { id }, { prisma }) => {
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

    procurementRequests: async (parent, { filter, limit = 50, offset = 0 }, { prisma }) => {
      const where = {};
      
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

    pendingRequests: async (parent, args, { prisma }) => {
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
    supplier: async (parent, { id }, { prisma }) => {
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

    suppliers: async (parent, { isActive, limit = 50, offset = 0 }, { prisma }) => {
      const where = {};
      if (isActive !== undefined) where.isActive = isActive;

      return await prisma.supplier.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { supplierName: 'asc' }
      });
    },

    // Buffer Stock queries
    bufferStock: async (parent, { id }, { prisma }) => {
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

    bufferStocks: async (parent, { filter, limit = 50, offset = 0 }, { prisma }) => {
      const where = {};
      
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

    lowStockItems: async (parent, args, { prisma }) => {
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
    serviceVendor: async (parent, { id }, { prisma }) => {
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

    serviceVendors: async (parent, { specialization, isActive }, { prisma }) => {
      const where = {};
      
      if (specialization) where.specialization = { contains: specialization, mode: 'insensitive' };
      if (isActive !== undefined) where.isActive = isActive;

      return await prisma.serviceVendor.findMany({
        where,
        orderBy: { vendorName: 'asc' }
      });
    },

    repairService: async (parent, { id }, { prisma }) => {
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

    repairServices: async (parent, { assetId, status, limit = 50, offset = 0 }, { prisma }) => {
      const where = {};
      
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
    assetAssignment: async (parent, { id }, { prisma }) => {
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

    assetAssignments: async (parent, { employeeId, assetId, status }, { prisma }) => {
      const where = {};
      
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

    overdueAssignments: async (parent, args, { prisma }) => {
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
    assetUtilizationReport: async (parent, { department, dateFrom, dateTo }, { prisma }) => {
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

      return result.map(row => ({
        assetType: row.asset_type,
        totalAssets: parseInt(row.total_assets),
        assignedAssets: parseInt(row.assigned_assets),
        utilizationRate: row.total_assets > 0 ? (row.assigned_assets / row.total_assets) * 100 : 0,
        department: row.department
      }));
    },

    procurementSpendingReport: async (parent, { dateFrom, dateTo }, { prisma }) => {
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

      return result.map(row => ({
        month: row.month.toISOString().substring(0, 7),
        totalSpending: parseFloat(row.total_spending) || 0,
        requestCount: parseInt(row.request_count),
        averageRequestValue: parseFloat(row.average_request_value) || 0,
        topCategory: row.top_category || 'Unknown'
      }));
    },

    bufferConsumptionReport: async (parent, { stockId, dateFrom, dateTo }, { prisma }) => {
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
      const grouped = consumptions.reduce((acc, consumption) => {
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
      }, {});

      return Object.values(grouped).map(item => ({
        itemName: item.itemName,
        totalConsumed: item.totalConsumed,
        consumptionsByDepartment: Object.entries(item.consumptionsByDepartment).map(([dept, qty]) => ({
          department: dept,
          quantity: qty,
          percentage: (qty / item.totalConsumed) * 100
        })),
        averageMonthlyConsumption: item.totalConsumed / Math.max(1, item.records.length)
      }));
    }
  },

  // Mutation resolvers
  Mutation: {
    // Employee mutations
    createEmployee: async (parent, { input }, { prisma, user }) => {
      return await prisma.employee.create({
        data: {
          ...input,
          isActive: true
        }
      });
    },

    updateEmployee: async (parent, { id, input }, { prisma, user }) => {
      try {
        return await prisma.employee.update({
          where: { employeeId: id },
          data: input
        });
      } catch (error) {
        if (error.code === 'P2025') {
          throw new GraphQLError('Employee not found', {
            extensions: { code: 'NOT_FOUND' }
          });
        }
        throw error;
      }
    },

    deactivateEmployee: async (parent, { id }, { prisma, user }) => {
      return await prisma.employee.update({
        where: { employeeId: id },
        data: { isActive: false }
      });
    },

    // Asset mutations
    createAsset: async (parent, { input }, { prisma, user }) => {
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

    updateAsset: async (parent, { id, input }, { prisma, user }) => {
      return await prisma.asset.update({
        where: { assetId: id },
        data: input,
        include: {
          supplier: true,
          primaryCustodian: true
        }
      });
    },

    disposeAsset: async (parent, { id, reason }, { prisma, user }) => {
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
    createProcurementRequest: async (parent, { input }, { prisma, user }) => {
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

      // Publish subscription event
      pubsub.publish(EVENTS.NEW_PROCUREMENT_REQUEST, {
        newProcurementRequest: request
      });

      return request;
    },

    approveProcurementRequest: async (parent, { id, approverId }, { prisma, user }) => {
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

    rejectProcurementRequest: async (parent, { id, approverId, reason }, { prisma, user }) => {
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

    completeProcurementRequest: async (parent, { id }, { prisma, user }) => {
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
    createSupplier: async (parent, { input }, { prisma, user }) => {
      return await prisma.supplier.create({
        data: {
          ...input,
          isActive: true
        }
      });
    },

    updateSupplier: async (parent, { id, input }, { prisma, user }) => {
      return await prisma.supplier.update({
        where: { supplierId: id },
        data: input
      });
    },

    deactivateSupplier: async (parent, { id }, { prisma, user }) => {
      return await prisma.supplier.update({
        where: { supplierId: id },
        data: { isActive: false }
      });
    },

    // Quotation mutations
    createQuotation: async (parent, { input }, { prisma, user }) => {
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

      // Publish subscription event
      pubsub.publish(EVENTS.QUOTATION_RECEIVED, {
        quotationReceived: quotation
      });

      return quotation;
    },

    selectQuotation: async (parent, { id }, { prisma, user }) => {
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
    createBufferStock: async (parent, { input }, { prisma, user }) => {
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

    updateBufferStockQuantity: async (parent, { id, quantity }, { prisma, user }) => {
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

    recordBufferConsumption: async (parent, { input }, { prisma, user }) => {
      return await prisma.$transaction(async (tx) => {
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

    approveBufferConsumption: async (parent, { id, approverId }, { prisma, user }) => {
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
    assignAsset: async (parent, { input }, { prisma, user }) => {
      return await prisma.$transaction(async (tx) => {
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

    returnAsset: async (parent, { assignmentId, conditionAtReturn }, { prisma, user }) => {
      return await prisma.$transaction(async (tx) => {
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
    createServiceVendor: async (parent, { input }, { prisma, user }) => {
      return await prisma.serviceVendor.create({
        data: {
          ...input,
          isActive: true
        }
      });
    },

    scheduleRepairService: async (parent, { input }, { prisma, user }) => {
      return await prisma.$transaction(async (tx) => {
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

    completeRepairService: async (parent, { id, completionDate, warrantyPeriod }, { prisma, user }) => {
      return await prisma.$transaction(async (tx) => {
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
    assignEquipmentManager: async (parent, { employeeId, department }, { prisma, user }) => {
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

    removeEquipmentManager: async (parent, { managerId }, { prisma, user }) => {
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
      subscribe: () =>
