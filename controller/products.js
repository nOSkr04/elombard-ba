import Product from "../models/Product.js";
import path from "path";
import Category from "../models/Category.js";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import User from "../models/User.js";

// api/v1/products
export const getProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Product);

  const products = await Product.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
    pagination,
  });
});

export const getUserProducts = asyncHandler(async (req, res, next) => {
  req.query.createUser = req.userId;
  return this.getProducts(req, res, next);
});

// api/v1/categories/:catId/products
export const getCategoryProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Product);

  //req.query, select
  const products = await Product.find(
    { ...req.query, category: req.params.categoryId },
    select
  )
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
    pagination,
  });
});

export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

export const createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(200).json({
    success: true,
    data: category,
  });
});

export const createProduct = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    throw new MyError(req.body.category + " ID-тэй категори байхгүй!", 400);
  }

  req.body.createUser = req.userId;

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    data: product,
  });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    product.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  product.remove();

  res.status(200).json({
    success: true,
    data: product,
    whoDeleted: user.name,
  });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (
    product.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    product[attr] = req.body[attr];
  }

  product.save();

  res.status(200).json({
    success: true,
    data: product,
  });
});

// PUT:  api/v1/products/:id/photo
export const uploadProductPhoto = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээ.", 400);
  }

  // image upload

  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    throw new MyError("Та зураг upload хийнэ үү.", 400);
  }

  if (file.size > process.env.MAX_UPLOAD_FILE_SIZE) {
    throw new MyError("Таны зурагны хэмжээ хэтэрсэн байна.", 400);
  }

  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new MyError(
        "Файлыг хуулах явцад алдаа гарлаа. Алдаа : " + err.message,
        400
      );
    }

    product.photo = file.name;
    product.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
