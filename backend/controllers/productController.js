const Product = require("../models/product");

exports.addProduct = async (req, res) => {
  try {
    const { name, description, priceIDR, media } = req.body;

    if (!media || !Array.isArray(media)) {
      return res.status(400).json({ message: "Media files are required" });
    }

    // Simpan media sebagai base64
    const mediaData = media.map((file) => ({
      data: file.data, // Base64 string
      contentType: file.contentType, // MIME type
    }));

    const newProduct = new Product({
      name,
      description,
      priceIDR: parseInt(priceIDR), // Only priceIDR
      media: mediaData,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all products (example - add pagination, filtering, etc. as needed)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // Sort by creation date
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, priceIDR, media } = req.body;

    // Find the existing product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // --- Input Validation (Important!) ---
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Product name is required" });
    }
    if (!description || description.trim() === "") {
      return res
        .status(400)
        .json({ message: "Product description is required" });
    }
    if (!priceIDR || isNaN(parseInt(priceIDR))) {
      return res.status(400).json({ message: "Valid IDR price is required" });
    }
    if (!media || !Array.isArray(media) || media.length === 0) {
      return res.status(400).json({ message: "Media files are required" });
    }

    // Check media content types (Example - adjust as needed)
    for (const item of media) {
      if (!item.contentType || !item.data) {
        return res.status(400).json({ message: "Invalid media data" });
      }
    }

    // --- Update fields ---
    product.name = name;
    product.description = description;
    product.priceIDR = parseInt(priceIDR);

    // Update media:  Handle Base64 data consistently
    product.media = media.map((item) => ({
      data: item.data,
      contentType: item.contentType,
    }));

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    // --- Improved Error Handling ---
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    //  Ideally, you would also delete the associated media files from the 'uploads' folder here.
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
