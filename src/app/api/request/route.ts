import { ResponseType } from '@/lib/types/apiResponse';
import RequestSchema from '@/server/models/Request';
import { ServerResponseBuilder } from '@/lib/builders/serverResponseBuilder';
import { InputException } from '@/lib/errors/inputExceptions';
import { PAGINATION_PAGE_SIZE } from '@/lib/constants/config';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const page = parseInt(url.searchParams.get('page') || '1');

  try {
    const query = status ? { status } : {};
    const requests = await RequestSchema.find(query)
      .sort({ requestCreatedDate: -1 })
      .skip((page - 1) * PAGINATION_PAGE_SIZE)
      .limit(PAGINATION_PAGE_SIZE);

    const totalRequests = await RequestSchema.countDocuments(query);

    return new Response(
      JSON.stringify({
        currentPage: page,
        totalPages: Math.ceil(totalRequests / PAGINATION_PAGE_SIZE),
        totalRequests,
        data: requests,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error: unknown) {
    if (error instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    if (error instanceof Error) {
      console.error('An unexpected error occurred:', error.message);
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}

export async function PUT(request: Request) {
  try {
    const req = await request.json();
    const newRequest = await RequestSchema.create({
      ...req,
      requestCreatedDate: new Date(),
      lastEditedDate: new Date(),
      status: 'pending',
    });
    return new Response(JSON.stringify(newRequest), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    if (error instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    if (error instanceof Error) {
      console.error('An unexpected error occurred:', error.message);
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}

export async function PATCH(request: Request) {
  try {
    const req = await request.json();
    const updatedRequest = await RequestSchema.findByIdAndUpdate(
      req.id,
      {
        status: req.status,
        lastEditedDate: new Date(),
      },
      { new: true },
    );

    if (!updatedRequest) {
      return new Response(JSON.stringify({ error: 'Request not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedRequest), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    if (error instanceof InputException) {
      return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
    if (error instanceof Error) {
      console.error('An unexpected error occurred:', error.message);
    }
    return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
  }
}
