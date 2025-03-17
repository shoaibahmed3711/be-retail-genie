import History from '../../models/buyer/history.models.js';

// Get all history entries
export const getAllHistory = async (req, res) => {
  try {
    const history = await History.find()
      .sort({ timestamp: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get history by type
export const getHistoryByType = async (req, res) => {
  try {
    const { type } = req.params;
    const history = await History.find({ type })
      .sort({ timestamp: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new history entry
export const createHistory = async (req, res) => {
  try {
    const newHistory = new History(req.body);
    const savedHistory = await newHistory.save();
    res.status(201).json(savedHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete history entry
export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHistory = await History.findByIdAndDelete(id);
    if (!deletedHistory) {
      return res.status(404).json({ message: 'History entry not found' });
    }
    res.status(200).json({ message: 'History entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get history by date range
export const getHistoryByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const history = await History.find({
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ timestamp: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};