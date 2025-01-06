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
    // Default page to 1 if not provided or invalid
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const status = req.query.status as string | null;

    // Build query based on status
    const query: { status?: string } = {};
    if (status) {
      query.status = status; // Add status filter if provided
    }

    // Get total count of matching documents
    const totalRequests = await RequestModel.countDocuments(query);

    // Fetch paginated results from the database
    const requests = await RequestModel.find(query)
      .sort({ requestCreatedDate: -1 }) // Sort by descending date
      .skip((page - 1) * PAGINATION_PAGE_SIZE)
      .limit(PAGINATION_PAGE_SIZE)
      .exec();

    // Return response with metadata and data
    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalRequests / PAGINATION_PAGE_SIZE),
      totalRequests,
      data: requests,
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
