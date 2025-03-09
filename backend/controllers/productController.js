const Product = require("../models/product");

exports.addProduct = async (req, res) => {
  try {
    const { name, description, priceUSD, priceIDR, media } = req.body;

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
      priceUSD: parseFloat(priceUSD),
      priceIDR: parseInt(priceIDR),
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
    const { name, description, priceUSD, priceIDR, media } = req.body;

    // Find the existing product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update fields
    product.name = name;
    product.description = description;
    product.priceUSD = parseFloat(priceUSD);
    product.priceIDR = parseInt(priceIDR);

    // Update media:  Handle Base64 data consistently
    if (media && Array.isArray(media)) {
      product.media = media.map((item) => ({
        data: item.data,
        contentType: item.contentType,
      }));
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    // Improved error handling (as before, but consolidated)
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
