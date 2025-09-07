const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function getBucketStart(date, bucket) {
  const d = new Date(date);
  if (bucket === 'day') {
    d.setUTCHours(0, 0, 0, 0);
  } else if (bucket === 'week') {
    const day = d.getUTCDay();
    d.setUTCDate(d.getUTCDate() - day);
    d.setUTCHours(0, 0, 0, 0);
  } else if (bucket === 'month') {
    d.setUTCDate(1);
    d.setUTCHours(0, 0, 0, 0);
  }
  return d;
}

async function getProductTrends(req, res) {
  const { startDate, endDate, bucket = 'day' } = req.query;
  const start = startDate ? new Date(startDate) : new Date('2000-01-01');
  const end = endDate ? new Date(endDate) : new Date();

  const trends = await prisma.productTrend.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
  });

  // Bucket data
  const buckets = {};
  for (const trend of trends) {
    const bucketStart = getBucketStart(trend.date, bucket).toISOString();
    if (!buckets[bucketStart]) {
      buckets[bucketStart] = { startDate: bucketStart, endDate: bucketStart, views: 0, sales: 0 };
    }
    buckets[bucketStart].views += trend.views;
    buckets[bucketStart].sales += trend.sales;
  }

  res.json(Object.values(buckets));
}

async function getVisitorLogs(req, res) {
  const { startDate, endDate, bucket = 'day' } = req.query;
  const start = startDate ? new Date(startDate) : new Date('2000-01-01');
  let end;
  if (endDate) {
    end = new Date(endDate);
    // Always set end to end of day if time is not specified
    if (endDate.length <= 10) {
      end.setHours(23, 59, 59, 999);
    }
  } else {
    end = new Date();
  }
  console.log('DEBUG: Query start:', start.toISOString(), 'end:', end.toISOString());
  // For testing, expand end date by one day to ensure logs are matched
  const testEnd = new Date(end);
  testEnd.setDate(testEnd.getDate() + 1);
  console.log('DEBUG: Expanded testEnd:', testEnd.toISOString());

  const logs = await prisma.visitorLog.findMany({
    where: {
      visitedAt: {
        gte: start,
        lte: end,
      },
    },
  });

  console.log('DEBUG: Found logs:', logs);
  // Bucket data
  const buckets = {};
  for (const log of logs) {
    const bucketStart = getBucketStart(log.visitedAt, bucket).toISOString();
    console.log('DEBUG: Log', log.id, 'visitedAt', log.visitedAt, 'bucketStart', bucketStart);
    if (!buckets[bucketStart]) {
      buckets[bucketStart] = { startDate: bucketStart, endDate: bucketStart, visits: 0 };
    }
    buckets[bucketStart].visits += 1;
  }

  console.log('DEBUG: Buckets:', buckets);
  res.json(Object.values(buckets));
}

module.exports = { getProductTrends, getVisitorLogs };
