import express, { Request, Response } from 'express';
import RequestModel from '../models/Request.js'; // Adjust the import as needed
import mongoose from 'mongoose';
import { PAGINATION_PAGE_SIZE } from '@/lib/constants/config';

const router = express.Router();

// Create a new request
router.put('/', async (req: Request, res: Response) => {
  try {
    const { requestorName, itemRequested } = req.body;
    const newRequest = await RequestModel.create({ requestorName, itemRequested });
    res.status(201).json(newRequest);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
});

// Get paginated requests
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1); // Default to page 1 if invalid or not provided
    const status = req.query.status as string | null;

    // Fetch all requests sorted by requestCreatedDate
    let requests = await RequestModel.find({})
      .sort({ requestCreatedDate: -1 })
      .exec();

    // Filter by status if provided
    if (status) {
      requests = requests.filter((req) => req.status === status);
    }
    
    // Pagination
    const totalRequests = requests.length;
    const startIndex = (page - 1) * PAGINATION_PAGE_SIZE;
    const endIndex = startIndex + PAGINATION_PAGE_SIZE;
    const paginatedRequests = requests.slice(startIndex, endIndex);

    // Return response with pagination metadata
    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalRequests / PAGINATION_PAGE_SIZE),
      totalRequests,
      data: paginatedRequests,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
});

// Update a request's status
router.patch('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, status } = req.body;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Validate the status
    if (!['pending', 'completed', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedRequest = await RequestModel.findByIdAndUpdate(
      id,
      { status, lastEditedDate: new Date() },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
});

export default router;
