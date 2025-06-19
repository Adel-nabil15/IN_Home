import mongoose from "mongoose";

const adSpendingSchema = new mongoose.Schema(
  {
    date: { type: String, default: () => new Date().toLocaleDateString("en-GB") },
    price: { type: Number },
    platform: { type: String },
    notes: { type: String },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    storename: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    productLink: {
      type: String,
      trim: true,
    },
    affiliateLink: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 1024,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    quantitySold: {
      type: Number,
      default: 0,
    },
    commission: {
      type: Number,
      required: true,
      min: 0,
    },
    adSpendingHistory: [adSpendingSchema],
    totalAdSpending: {
      type: Number,
      default: 0,
    },
    totalCommission: {
      type: Number,
      default: 0,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: { 
      type: String,
      trim: true,
    },
    isFreezed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
ProductSchema.pre("save", function (next) {
  if (this.isModified("adSpendingHistory")) {
    this.totalAdSpending = this.adSpendingHistory.reduce(
      (acc, curr) => acc + curr.price,
      0
    );
  }

  if (this.isModified("quantitySold")) {
    this.totalCommission = this.quantitySold * this.commission;
  }

  next();
});
const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;
