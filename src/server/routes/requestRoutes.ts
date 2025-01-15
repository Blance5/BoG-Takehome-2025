import express, { Request, Response } from 'express';
import RequestModel from '../models/Request.js'; // Adjust the import as needed
import mongoose from 'mongoose';
import { PAGINATION_PAGE_SIZE } from '@/lib/constants/config';

const router = express.Router();

// Create a new request
router.put('/', async (req: Request, res: Response) => {
  try {
    const { requestorName, itemRequested } = req.body;
    const newRequest = await RequestModel.create({
      requestorName,
      itemRequested,
    });
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
      query.status = status;
    }

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

// Update a single request's status
router.patch('/', async (req: Request, res: Response) => {
  try {
    const { id, status } = req.body; // Expecting an object with `id` and `status`

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Invalid ID format received:', id);
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    if (!['pending', 'completed', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedRequest = await RequestModel.findByIdAndUpdate(
      id,
      { status, lastEditedDate: new Date() },
      { new: true },
    );

    // request was not found
    if (!updatedRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.status(200).json({ success: true, updatedRequest });
  } catch (error) {
    console.error('Error updating request:', error);
    res
      .status(500)
      .json({
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
  }
});

router.patch('/batch', async (req: Request, res: Response) => {
  try {
    const { updates } = req.body; // Expecting an array of updates
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: 'Invalid updates array' });
    }

    const results = [];
    for (const update of updates) {
      const { id, status } = update;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error('Invalid ID format received:', id);
        results.push({ id, error: 'Invalid ID format' });
        continue;
      }
      if (!['pending', 'completed', 'approved', 'rejected'].includes(status)) {
        results.push({ id, error: 'Invalid status' });
        continue;
      }

      const updatedRequest = await RequestModel.findByIdAndUpdate(
        id,
        { status, lastEditedDate: new Date() },
        { new: true },
      );

      console.log('Update result for ID:', id, updatedRequest);

      if (!updatedRequest) {
        results.push({ id, error: 'Request not found' });
      } else {
        results.push({ id, success: true, updatedRequest });
      }
    }

    res.status(200).json({ results });
  } catch (error) {
    res
      .status(500)
      .json({
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
  }
});

router.delete('/batch', async (req: Request, res: Response) => {
  try {
    const { ids } = req.body; // Expecting an array of IDs
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid IDs array' });
    }

    const results = [];
    for (const id of ids) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        results.push({ id, error: 'Invalid ID format' });
        continue;
      }

      const deletedRequest = await RequestModel.findByIdAndDelete(id);

      if (!deletedRequest) {
        results.push({ id, error: 'Request not found' });
      } else {
        results.push({ id, success: true });
      }
    }

    res.status(200).json({ results });
  } catch (error) {
    res
      .status(500)
      .json({
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
  }
});

export default router;
