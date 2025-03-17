import Favourite from '../../models/buyer/favourites.models.js';

export const addFavourite = async (req, res) => {
  try {
    const favourite = new Favourite({
      ...req.body,
      userId: req.user._id // Assuming you have user data in request from auth middleware
    });
    await favourite.save();
    res.status(201).json({ success: true, data: favourite });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find({ userId: req.user._id });
    res.status(200).json({ success: true, data: favourites });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getFavouriteById = async (req, res) => {
  try {
    const favourite = await Favourite.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!favourite) {
      return res.status(404).json({ success: false, error: 'Favourite not found' });
    }
    res.status(200).json({ success: true, data: favourite });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateFavourite = async (req, res) => {
  try {
    const favourite = await Favourite.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!favourite) {
      return res.status(404).json({ success: false, error: 'Favourite not found' });
    }
    res.status(200).json({ success: true, data: favourite });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteFavourite = async (req, res) => {
  try {
    const favourite = await Favourite.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!favourite) {
      return res.status(404).json({ success: false, error: 'Favourite not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getFavouritesByType = async (req, res) => {
  try {
    const favourites = await Favourite.find({
      userId: req.user._id,
      type: req.params.type
    });
    res.status(200).json({ success: true, data: favourites });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getFavouritesByCategory = async (req, res) => {
  try {
    const favourites = await Favourite.find({
      userId: req.user._id,
      category: req.params.category
    });
    res.status(200).json({ success: true, data: favourites });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};