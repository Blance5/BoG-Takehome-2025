import express, { Request, Response } from 'express';
import RequestModel from '../models/Request.js'; // Adjust the import as needed
import mongoose from 'mongoose';

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
    const { page = 1, status } = req.query;
    const PAGE_SIZE = 10;

    const query = status ? { status } : {};
    const requests = await RequestModel.find(query)
      .sort({ requestCreatedDate: -1 })
      .skip((Number(page) - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);

    res.json(requests);
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
