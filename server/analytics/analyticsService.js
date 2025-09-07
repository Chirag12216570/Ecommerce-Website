const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Record a product view
async function recordProductView(productId) {
  const today = new Date();
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  await prisma.productTrend.upsert({
    where: {
      productId_date: { productId, date }
    },
    update: {
      views: { increment: 1 }
    },
    create: {
      productId,
      date,
      views: 1,
      sales: 0
    }
  });
}

// Record a product sale
async function recordProductSale(productId) {
  const today = new Date();
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  await prisma.productTrend.upsert({
    where: {
      productId_date: { productId, date }
    },
    update: {
      sales: { increment: 1 }
    },
    create: {
      productId,
      date,
      views: 0,
      sales: 1
    }
  });
}

// Log a visitor action
async function logVisitorAction({ userId, action, productId }) {
  await prisma.visitorLog.create({
    data: {
      userId,
      action,
      productId,
      visitedAt: new Date()
    }
  });
}

module.exports = {
  recordProductView,
  recordProductSale,
  logVisitorAction
};