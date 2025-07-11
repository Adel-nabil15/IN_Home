import mongoose from "mongoose";
import ExcelJS from "exceljs";
import ProductModel from "../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/Error/index.js";

// ----------------------- addProduct -----------------------
export const addProduct = asyncHandler(async (req, res, next) => {
  // get data from body
  const {
    name,
    storename,
    productLink,
    affiliateLink,
    description,
    price,
    quantity,
    commission,
    adSpendingHistory,
    quantitySold,
  } = req.body;

  // create new product
  const newProduct = new ProductModel({
    name,
    storename,
    productLink,
    affiliateLink,
    description,
    price,
    quantity,
    commission,
    addedBy: req.user._id,
    adSpendingHistory,
    quantitySold,
  });
  await newProduct.save();
  // send response to client
  res.status(200).json({ message: "success", product: newProduct });
});

// ----------------------- updateProduct -----------------------
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // check if product id is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new Error("Invalid product ID", { cause: 400 }));
  }
  // get product from database
  const product = await ProductModel.findOne({ _id: id, isFreezed: false });
  if (!product) {
    return next(new Error("product not found", { cause: 404 }));
  }
  // get data from body
  const {
    name,
    storename,
    productLink,
    affiliateLink,
    description,
    price,
    quantity,
    commission,
    adSpendingHistory,
    quantitySold,
    isFreezed,
  } = req.body;
  // update product
  if (name) product.name = name;
  if (storename) product.storename = storename;
  if (productLink) product.productLink = productLink;
  if (affiliateLink) product.affiliateLink = affiliateLink;
  if (description) product.description = description;
  if (price) product.price = price;
  if (quantity) product.quantity = quantity;
  if (commission) product.commission = commission;
  if (adSpendingHistory) product.adSpendingHistory = adSpendingHistory;
  if (quantitySold) product.quantitySold = quantitySold;
  if (isFreezed) product.isFreezed = isFreezed;
  // save product to database
  await product.save();
  // send response to client
  res.status(200).json({ message: "product updated successfully", product });
});

// ----------------------- getProducts -----------------------
export const getProducts = asyncHandler(async (req, res, next) => {
  // get all products
  const products = await ProductModel.find({ isFreezed: false }).populate(
    "addedBy",
    "name email phone"
  );
  // check if products exists
  if (products.length === 0) {
    return next(new Error("products not found", { cause: 404 }));
  }
  // send response to client
  res.status(200).json({ message: "products fetched successfully", products });
});

// ----------------------- getOneProduct -----------------------
export const getOneProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // check if product id is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new Error("Invalid product ID", { cause: 400 }));
  }
  // get product from database
  const product = await ProductModel.findOne({
    _id: id,
    isFreezed: false,
  }).populate("addedBy", "name email");
  // check if product exists
  if (!product) {
    return next(new Error("product not found", { cause: 404 }));
  }
  // send response to client
  res.status(200).json({ message: "product fetched successfully", product });
});


// ----------------------- exportProductsToExcel -----------------------
export const exportProductsToExcel = asyncHandler(async (req, res, next) => {
  // get all products
  const products = await ProductModel.find({ isFreezed: false }).populate(
    "addedBy",
    "name email phone"
  );

  // check if products exist
  if (products.length === 0) {
    return next(new Error("products not found", { cause: 404 }));
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data of Products");

  worksheet.columns = [
    { header: "Product Name", key: "name", width: 20 },
    { header: "Store Name", key: "storename", width: 20 },
    { header: "Product Link", key: "productLink", width: 20 },
    { header: "Affiliate Link", key: "affiliateLink", width: 20 },
    { header: "Description", key: "description", width: 20 },
    { header: "Price", key: "price", width: 20 },
    { header: "Quantity", key: "quantity", width: 20 },
    { header: "Quantity Sold", key: "quantitySold", width: 20 },
    { header: "Commission", key: "commission", width: 20 },
    { header: "Total Commission", key: "totalCommission", width: 20 },
    { header: "Added By", key: "addedBy", width: 20 },
    { header: "Added At", key: "createdAt", width: 20 },
    { header: "Ad Spending History", key: "adSpendingHistory", width: 40 },
    { header: "Total Ad Spending", key: "totalAdSpending", width: 20 },
  ];

  // style header
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F4E78" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // style all columns (center + wrap)
  worksheet.columns.forEach((column) => {
    column.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
  });

  // add products to worksheet
  products.forEach((product) => {
    const adHistoryString = product.adSpendingHistory?.length
      ? product.adSpendingHistory
          .map(
            (ad, index) =>
              `${index + 1}. date: ${ad.date}\n   platform: ${ad.platform}\n   price: ${ad.price}\n   notes: ${ad.notes ?? "No Notes"}`
          )
          .join("\n\n")
      : "لا يوجد إعلانات";

    worksheet.addRow({
      name: product.name,
      storename: product.storename,
      productLink: product.productLink,
      affiliateLink: product.affiliateLink,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      quantitySold: product.quantitySold,
      commission: product.commission,
      totalCommission: product.totalCommission,
      addedBy: product.addedBy?.name || "غير معروف",
      createdAt: product.createdAt,
      adSpendingHistory: adHistoryString,
      totalAdSpending: product.totalAdSpending,
    });
  });

  // style name column
  const nameColumn = worksheet.getColumn("name");
  nameColumn.eachCell({ includeEmpty: false }, (cell, rowNumber) => {
    if (rowNumber > 1) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFCCE5FF" }, 
      };
      cell.font = {
        color: { argb: "FF000000" }, 
        bold: true,
      };
    }
  });

  // add borders to all cells
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // export file
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=products.xlsx");

  await workbook.xlsx.write(res);
  res.end();
});
