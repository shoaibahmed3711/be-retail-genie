import BuyerRequest from '../../models/buyer/requests.models.js';

export const createRequest = async (req, res) => {
  try {
    const request = new BuyerRequest(req.body);
    const savedRequest = await request.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await BuyerRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const request = await BuyerRequest.findOne({ id: req.params.id });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRequest = async (req, res) => {
  try {
    const updatedRequest = await BuyerRequest.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const request = await BuyerRequest.findOneAndDelete({ id: req.params.id });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRequestsByStatus = async (req, res) => {
  try {
    const requests = await BuyerRequest.find({ status: req.params.status });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const updatedRequest = await BuyerRequest.findOneAndUpdate(
      { id: req.params.id },
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};