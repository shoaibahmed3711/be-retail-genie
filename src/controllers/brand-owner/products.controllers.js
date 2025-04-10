import Product from '../../models/brand-owner/products.models.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Identify all potential array fields from model schema
    const arrayFields = [
      'tags', 
      'packaging.multipleLanguages.languages', 
      'packaging.ingredients.ingredientsList', 
      'packaging.ingredients.foreignIngredients.sourceCountries',
      'packaging.callouts.calloutList', 
      'certifications.certificationList',
      'distribution.retailers'
    ];
    
    // Process array fields
    arrayFields.forEach(field => {
      const fieldPath = field.split('.');
      let currentObj = productData;
      let exists = true;
      
      // Navigate to the nested property location
      for (let i = 0; i < fieldPath.length - 1; i++) {
        if (!currentObj || !currentObj[fieldPath[i]]) {
          exists = false;
          break;
        }
        currentObj = currentObj[fieldPath[i]];
      }
      
      // Parse the JSON string to array if it exists
      const lastField = fieldPath[fieldPath.length - 1];
      if (exists && currentObj && currentObj[lastField] && typeof currentObj[lastField] === 'string') {
        try {
          currentObj[lastField] = JSON.parse(currentObj[lastField]);
        } catch (e) {
          // If not valid JSON, keep as is or convert to array
          if (!Array.isArray(currentObj[lastField])) {
            if (currentObj[lastField].includes(',')) {
              currentObj[lastField] = currentObj[lastField].split(',').map(item => item.trim());
            } else if (currentObj[lastField].trim() !== '') {
              currentObj[lastField] = [currentObj[lastField]];
            } else {
              currentObj[lastField] = [];
            }
          }
        }
      }
    });
    
    // Process complex objects
    const complexObjects = [
      'distribution.distributors',
      'broker.brokers',
      'allergens',
      'packaging.productBarcode',
      'packaging.multipleLanguages',
      'packaging.unitPackaging',
      'packaging.casePackaging',
      'packaging.innerCasePackaging',
      'packaging.callouts',
      'packaging.ingredients',
      'packaging.ingredients.foreignIngredients',
      'packaging.shelfLife',
      'packaging.nutritionalInfo',
      'certifications',
      'marketing'
    ];
    
    complexObjects.forEach(field => {
      const fieldPath = field.split('.');
      let currentObj = productData;
      let exists = true;
      
      // Navigate to the nested property location
      for (let i = 0; i < fieldPath.length - 1; i++) {
        if (!currentObj || !currentObj[fieldPath[i]]) {
          exists = false;
          break;
        }
        currentObj = currentObj[fieldPath[i]];
      }
      
      const lastField = fieldPath[fieldPath.length - 1];
      if (exists && currentObj && typeof currentObj[lastField] === 'string') {
        try {
          currentObj[lastField] = JSON.parse(currentObj[lastField]);
        } catch (e) {
          console.warn(`Failed to parse ${field}:`, e);
        }
      }
    });
    
    // Special handling for distributors and brokers which must be arrays of objects
    if (productData.distribution && productData.distribution.distributors) {
      if (typeof productData.distribution.distributors === 'string') {
        try {
          productData.distribution.distributors = JSON.parse(productData.distribution.distributors);
        } catch (e) {
          // If parsing fails, ensure it's at least an empty array, not a string
          productData.distribution.distributors = [];
          console.log('Converted distributors to empty array due to parsing error');
        }
      } else if (!Array.isArray(productData.distribution.distributors)) {
        productData.distribution.distributors = [];
        console.log('Converted distributors to empty array because it was not an array');
      }
    }

    if (productData.broker && productData.broker.brokers) {
      if (typeof productData.broker.brokers === 'string') {
        try {
          productData.broker.brokers = JSON.parse(productData.broker.brokers);
        } catch (e) {
          // If parsing fails, ensure it's at least an empty array, not a string
          productData.broker.brokers = [];
          console.log('Converted brokers to empty array due to parsing error');
        }
      } else if (!Array.isArray(productData.broker.brokers)) {
        productData.broker.brokers = [];
        console.log('Converted brokers to empty array because it was not an array');
      }
    }
    
    // Process boolean fields
    const booleanFields = [
      'packaging.productBarcode.hasUPC',
      'packaging.multipleLanguages.hasMultipleLanguages',
      'packaging.casePackaging.hasCasePacking',
      'packaging.innerCasePackaging.hasInnerCase',
      'packaging.callouts.hasCallouts',
      'packaging.ingredients.isFrozen',
      'packaging.ingredients.isRefrigerated',
      'packaging.ingredients.isShelfStable',
      'packaging.ingredients.hasIngredients',
      'packaging.ingredients.foreignIngredients.hasSourcedIngredients',
      'packaging.shelfLife.hasShelfLife',
      'packaging.nutritionalInfo.hasNutritionalLabel',
      'certifications.hasCertifications',
      'distribution.hasDistributors',
      'broker.hasBrokers',
      'marketing.hasElevatorPitch',
      'marketing.hasSellSheet',
      'marketing.hasPresentation'
    ];
    
    booleanFields.forEach(field => {
      const fieldPath = field.split('.');
      let currentObj = productData;
      let exists = true;
      
      // Navigate to the nested property location
      for (let i = 0; i < fieldPath.length - 1; i++) {
        if (!currentObj || !currentObj[fieldPath[i]]) {
          exists = false;
          break;
        }
        currentObj = currentObj[fieldPath[i]];
      }
      
      const lastField = fieldPath[fieldPath.length - 1];
      if (exists && currentObj && currentObj[lastField] !== undefined) {
        if (typeof currentObj[lastField] === 'string') {
          currentObj[lastField] = currentObj[lastField].toLowerCase() === 'true';
        } else {
          currentObj[lastField] = Boolean(currentObj[lastField]);
        }
      }
    });
    
    // Process numeric fields
    const numericFields = [
      'msrp', 'retailMargin', 'wholesalePrice', 'casePackSize', 
      'casePrice', 'cogs', 'stock', 'discount',
      'packaging.unitPackaging.height',
      'packaging.unitPackaging.width',
      'packaging.unitPackaging.length',
      'packaging.unitPackaging.weight',
      'packaging.unitPackaging.volume',
      'packaging.casePackaging.height',
      'packaging.casePackaging.width',
      'packaging.casePackaging.length',
      'packaging.casePackaging.weight',
      'packaging.casePackaging.volume',
      'packaging.casePackaging.casesPerTier',
      'packaging.casePackaging.tiersPerPallet',
      'packaging.innerCasePackaging.unitsPerInnerCase',
      'packaging.innerCasePackaging.height',
      'packaging.innerCasePackaging.width',
      'packaging.innerCasePackaging.length',
      'packaging.innerCasePackaging.weight',
      'packaging.shelfLife.value',
      'salesCount',
      'revenue',
      'rating'
    ];
    
    numericFields.forEach(field => {
      const fieldPath = field.split('.');
      let currentObj = productData;
      let exists = true;
      
      // Navigate to the nested property location
      for (let i = 0; i < fieldPath.length - 1; i++) {
        if (!currentObj || !currentObj[fieldPath[i]]) {
          exists = false;
          break;
        }
        currentObj = currentObj[fieldPath[i]];
      }
      
      const lastField = fieldPath[fieldPath.length - 1];
      if (exists && currentObj && currentObj[lastField] !== undefined && currentObj[lastField] !== '') {
        currentObj[lastField] = Number(currentObj[lastField]);
      }
    });
    
    // Handle file uploads
    const fileHandlers = {
      productImage: 'imageUrl',
      ingredientsLabel: 'packaging.ingredients.ingredientsLabelImage',
      nutritionalLabel: 'packaging.nutritionalInfo.nutritionalLabelImage',
      elevatorPitchFile: 'marketing.elevatorPitchFile',
      sellSheetFile: 'marketing.sellSheetFile',
      presentationFile: 'marketing.presentationFile'
    };
    
    Object.entries(fileHandlers).forEach(([reqField, modelField]) => {
      if (req.files && req.files[reqField] && req.files[reqField][0]) {
        // Convert file path for URL access
        const relativePath = `/uploads/${reqField}/${req.files[reqField][0].filename}`;
        
        // Set the value in the correct nested location in productData
        const fieldPath = modelField.split('.');
        let currentObj = productData;
        
        // Create nested objects if they don't exist
        for (let i = 0; i < fieldPath.length - 1; i++) {
          if (!currentObj[fieldPath[i]]) {
            currentObj[fieldPath[i]] = {};
          }
          currentObj = currentObj[fieldPath[i]];
        }
        
        // Set the file path
        const lastField = fieldPath[fieldPath.length - 1];
        currentObj[lastField] = relativePath;
        
        // Save file details for tracking
        if (reqField === 'productImage') {
          productData.imageDetails = {
            originalName: req.files[reqField][0].originalname,
            mimetype: req.files[reqField][0].mimetype,
            size: req.files[reqField][0].size
          };
        }
      }
    });
    
    console.log('Creating product with data:', JSON.stringify(productData, null, 2));
    
    const product = new Product(productData);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Identify all potential array fields from model schema
    const arrayFields = [
      'tags', 
      'packaging.multipleLanguages.languages', 
      'packaging.ingredients.ingredientsList', 
      'packaging.ingredients.foreignIngredients.sourceCountries',
      'packaging.callouts.calloutList', 
      'certifications.certificationList',
      'distribution.retailers'
    ];
    
    // Process array fields
    arrayFields.forEach(field => {
      const fieldPath = field.split('.');
      let currentObj = productData;
      let exists = true;
      
      // Navigate to the nested property location
      for (let i = 0; i < fieldPath.length - 1; i++) {
        if (!currentObj || !currentObj[fieldPath[i]]) {
          exists = false;
          break;
        }
        currentObj = currentObj[fieldPath[i]];
      }
      
      // Parse the JSON string to array if it exists
      const lastField = fieldPath[fieldPath.length - 1];
      if (exists && currentObj && currentObj[lastField] && typeof currentObj[lastField] === 'string') {
        try {
          currentObj[lastField] = JSON.parse(currentObj[lastField]);
        } catch (e) {
          // If not valid JSON, keep as is or convert to array
          if (!Array.isArray(currentObj[lastField])) {
            if (currentObj[lastField].includes(',')) {
              currentObj[lastField] = currentObj[lastField].split(',').map(item => item.trim());
            } else if (currentObj[lastField].trim() !== '') {
              currentObj[lastField] = [currentObj[lastField]];
            } else {
              currentObj[lastField] = [];
            }
          }
        }
      }
    });
    
    // Process complex objects
    const complexObjects = [
      'distribution.distributors',
      'broker.brokers',
      'allergens',
      'packaging.productBarcode',
      'packaging.multipleLanguages',
      'packaging.unitPackaging',
      'packaging.casePackaging',
      'packaging.innerCasePackaging',
      'packaging.callouts',
      'packaging.ingredients',
      'packaging.ingredients.foreignIngredients',
      'packaging.shelfLife',
      'packaging.nutritionalInfo',
      'certifications',
      'marketing'
    ];
    
    complexObjects.forEach(field => {
      const fieldPath = field.split('.');
      let currentObj = productData;
      let exists = true;
      
      // Navigate to the nested property location
      for (let i = 0; i < fieldPath.length - 1; i++) {
        if (!currentObj || !currentObj[fieldPath[i]]) {
          exists = false;
          break;
        }
        currentObj = currentObj[fieldPath[i]];
      }
      
      const lastField = fieldPath[fieldPath.length - 1];
      if (exists && currentObj && typeof currentObj[lastField] === 'string') {
        try {
          currentObj[lastField] = JSON.parse(currentObj[lastField]);
        } catch (e) {
          console.warn(`Failed to parse ${field}:`, e);
        }
      }
    });
    
    // Special handling for distributors and brokers which must be arrays of objects
    if (productData.distribution && productData.distribution.distributors) {
      if (typeof productData.distribution.distributors === 'string') {
        try {
          productData.distribution.distributors = JSON.parse(productData.distribution.distributors);
        } catch (e) {
          // If parsing fails, ensure it's at least an empty array, not a string
          productData.distribution.distributors = [];
          console.log('Converted distributors to empty array due to parsing error');
        }
      } else if (!Array.isArray(productData.distribution.distributors)) {
        productData.distribution.distributors = [];
        console.log('Converted distributors to empty array because it was not an array');
      }
    }

    if (productData.broker && productData.broker.brokers) {
      if (typeof productData.broker.brokers === 'string') {
        try {
          productData.broker.brokers = JSON.parse(productData.broker.brokers);
        } catch (e) {
          // If parsing fails, ensure it's at least an empty array, not a string
          productData.broker.brokers = [];
          console.log('Converted brokers to empty array due to parsing error');
        }
      } else if (!Array.isArray(productData.broker.brokers)) {
        productData.broker.brokers = [];
        console.log('Converted brokers to empty array because it was not an array');
      }
    }
    
    // Process boolean fields
    const booleanFields = [
      'packaging.productBarcode.hasUPC',
      'packaging.multipleLanguages.hasMultipleLanguages',
      'packaging.casePackaging.hasCasePacking',
      'packaging.innerCasePackaging.hasInnerCase',
      'packaging.callouts.hasCallouts',
      'packaging.ingredients.isFrozen',
      'packaging.ingredients.isRefrigerated',
      'packaging.ingredients.isShelfStable',
      'packaging.ingredients.hasIngredients',
      'packaging.ingredients.foreignIngredients.hasSourcedIngredients',
      'packaging.shelfLife.hasShelfLife',
      'packaging.nutritionalInfo.hasNutritionalLabel',
      'certifications.hasCertifications',
      'distribution.hasDistributors',
      'broker.hasBrokers',
      'marketing.hasElevatorPitch',
      'marketing.hasSellSheet',
      'marketing.hasPresentation'
    ];
    
    booleanFields.forEach(field => {
      const fieldPath = field.split('.');
      let currentObj = productData;
      let exists = true;
      
      // Navigate to the nested property location
      for (let i = 0; i < fieldPath.length - 1; i++) {
        if (!currentObj || !currentObj[fieldPath[i]]) {
          exists = false;
          break;
        }
        currentObj = currentObj[fieldPath[i]];
      }
      
      const lastField = fieldPath[fieldPath.length - 1];
      if (exists && currentObj && currentObj[lastField] !== undefined) {
        if (typeof currentObj[lastField] === 'string') {
          currentObj[lastField] = currentObj[lastField].toLowerCase() === 'true';
        } else {
          currentObj[lastField] = Boolean(currentObj[lastField]);
        }
      }
    });
    
    // Process numeric fields
    const numericFields = [
      'msrp', 'retailMargin', 'wholesalePrice', 'casePackSize', 
      'casePrice', 'cogs', 'stock', 'discount',
      'packaging.unitPackaging.height',
      'packaging.unitPackaging.width',
      'packaging.unitPackaging.length',
      'packaging.unitPackaging.weight',
      'packaging.unitPackaging.volume',
      'packaging.casePackaging.height',
      'packaging.casePackaging.width',
      'packaging.casePackaging.length',
      'packaging.casePackaging.weight',
      'packaging.casePackaging.volume',
      'packaging.casePackaging.casesPerTier',
      'packaging.casePackaging.tiersPerPallet',
      'packaging.innerCasePackaging.unitsPerInnerCase',
      'packaging.innerCasePackaging.height',
      'packaging.innerCasePackaging.width',
      'packaging.innerCasePackaging.length',
      'packaging.innerCasePackaging.weight',
      'packaging.shelfLife.value',
      'salesCount',
      'revenue',
      'rating'
    ];
    
    numericFields.forEach(field => {
      const fieldPath = field.split('.');
      let currentObj = productData;
      let exists = true;
      
      // Navigate to the nested property location
      for (let i = 0; i < fieldPath.length - 1; i++) {
        if (!currentObj || !currentObj[fieldPath[i]]) {
          exists = false;
          break;
        }
        currentObj = currentObj[fieldPath[i]];
      }
      
      const lastField = fieldPath[fieldPath.length - 1];
      if (exists && currentObj && currentObj[lastField] !== undefined && currentObj[lastField] !== '') {
        currentObj[lastField] = Number(currentObj[lastField]);
      }
    });
    
    // Handle file uploads
    const fileHandlers = {
      productImage: 'imageUrl',
      ingredientsLabel: 'packaging.ingredients.ingredientsLabelImage',
      nutritionalLabel: 'packaging.nutritionalInfo.nutritionalLabelImage',
      elevatorPitchFile: 'marketing.elevatorPitchFile',
      sellSheetFile: 'marketing.sellSheetFile',
      presentationFile: 'marketing.presentationFile'
    };
    
    Object.entries(fileHandlers).forEach(([reqField, modelField]) => {
      if (req.files && req.files[reqField] && req.files[reqField][0]) {
        // Convert file path for URL access
        const relativePath = `/uploads/${reqField}/${req.files[reqField][0].filename}`;
        
        // Set the value in the correct nested location in productData
        const fieldPath = modelField.split('.');
        let currentObj = productData;
        
        // Create nested objects if they don't exist
        for (let i = 0; i < fieldPath.length - 1; i++) {
          if (!currentObj[fieldPath[i]]) {
            currentObj[fieldPath[i]] = {};
          }
          currentObj = currentObj[fieldPath[i]];
        }
        
        // Set the file path
        const lastField = fieldPath[fieldPath.length - 1];
        currentObj[lastField] = relativePath;
        
        // Save file details for tracking
        if (reqField === 'productImage') {
          productData.imageDetails = {
            originalName: req.files[reqField][0].originalname,
            mimetype: req.files[reqField][0].mimetype,
            size: req.files[reqField][0].size
          };
        }
      }
    });
    
    console.log('Updating product with data:', JSON.stringify(productData, null, 2));
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Product update error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Record product sale
export const recordProductSale = async (req, res) => {
  try {
    const { quantity, salePrice } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.recordSale(quantity, salePrice);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
