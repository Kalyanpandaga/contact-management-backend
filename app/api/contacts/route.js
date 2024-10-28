import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

const buildFilters = (body) => {
  const { name, email, timezone, from_date, to_date } = body;

  const filters = {};

  if (name) {
    filters.name = { contains: name };
  }
  if (email) {
    filters.email = { contains: email };
  }
  if (timezone) {
    filters.timezone = timezone;
  }

  if (from_date || to_date) {
    filters.createdAt = {};
    if (from_date) {
      filters.createdAt.gte = new Date(from_date);
    }
    if (to_date) {
      filters.createdAt.lte = new Date(to_date);
    }
  }

  return filters;
};

const validateSortAndPagination = (query) => {
  const allowedSortByFields = ['name', 'email', 'timezone', 'createdAt', 'updatedAt'];
  const allowedSortOrders = ['asc', 'desc'];

  const sortBy = allowedSortByFields.includes(query.get('sortBy')) ? query.get('sortBy') : 'createdAt';
  const sortOrder = allowedSortOrders.includes(query.get('sortOrder')) ? query.get('sortOrder') : 'asc';
  const offset = parseInt(query.get('offset')) >= 0 ? parseInt(query.get('offset')) : 0;
  const limit = parseInt(query.get('limit')) >= 1 ? parseInt(query.get('limit')) : 10;

  return { sortBy, sortOrder, offset, limit };
};

export async function POST(req) {
  const url = new URL(req.url);
  const query = url.searchParams;
  const body = await req.json();

  const { sortBy, sortOrder, offset, limit } = validateSortAndPagination(query);
  const filters = buildFilters(body);

  try {
    const contacts = await prisma.contact.findMany({
      where: {
        ...filters,
        isDeleted: false, 
      },
      orderBy: { [sortBy]: sortOrder },
      skip: offset * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        timezone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalContacts = await prisma.contact.count({ where: filters });

    const response = {
      total_count: totalContacts,
      contacts,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error retrieving contacts.' }, { status: 500 });
  }
}
