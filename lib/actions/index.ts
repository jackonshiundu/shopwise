"use server";

import Product from "@/models/product.medel";
import { connectToDB } from "../mongoose";
import { scrapeYourProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { revalidatePath } from "next/cache";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl: string) {
  // TODO: Implement this function
  if (!productUrl) return;

  try {
    connectToDB();
    const scrapedProduct = await scrapeYourProduct(productUrl);
    if (!scrapedProduct) return;

    // TODO: Implement this function
    let product = scrapedProduct;
    const imageUrl: any = scrapedProduct.image[0];
    const existingProduct = await Product.findOne({ url: scrapedProduct.url });
    if (existingProduct) {
      const updatedPricehistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPricehistory,
        lowestPrice: getLowestPrice(updatedPricehistory),
        highestPrice: getHighestPrice(updatedPricehistory),
        averagePrice: getAveragePrice(updatedPricehistory),
      };
    }
    product = { ...product, image: imageUrl };
    const newProduct = await Product.findOneAndUpdate(
      {
        url: scrapedProduct.url,
      },
      product,
      { upsert: true, new: true }
    );
    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create Update product:${error.message}`);
  }
}
export async function getProductById(productId: string) {
  try {
    connectToDB();
    const product = await Product.findOne({ _id: productId });
    if (!product) return null;
    return product;
  } catch (error) {
    console.log(error);
  }
}
export async function getAllProducts() {
  try {
    connectToDB();
    const products = await Product.find({});
    return products;
  } catch (error) {
    console.log(error);
  }
}
export async function getSimmilarProducts(productId: string) {
  try {
    connectToDB();
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) return null;
    const simmilarProducts = await Product.find({
      _id: { $ne: productId },
    }).limit(3);
    return simmilarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailtoProduct(
  productId: string,
  userEmail: string
) {
  try {
    const product = await Product.findById(productId);

    if (!product) return;
    //cheking if the user already exxiss of the user tracking a product
    const userExists = product.users.some(
      (user: User) => user.email === userEmail
    );
    if (!userExists) {
      product.users.push({ email: userEmail });
      await product.save();

      const emailContent = await generateEmailBody(product, "WELCOME");

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
}
