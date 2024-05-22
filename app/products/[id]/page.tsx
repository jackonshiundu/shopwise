import Modal from "@/components/Modal";
import PriceInoCard from "@/components/priceinfocard";
import ProductCard from "@/components/productcard";
import { getProductById, getSimmilarProducts } from "@/lib/actions";
import { formatNumber } from "@/lib/utils";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
type Props = { params: { id: string } };
const Productdetail = async ({ params: { id } }: Props) => {
  const product: Product = await getProductById(id);
  if (!product) redirect("/");
  const simmilarProducts = await getSimmilarProducts(id);
  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="product-image">
          {" "}
          <Image
            src={product.image[0]}
            alt={product.title}
            width={580}
            height={400}
            className="mx-auto"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] text-secondary font-semibold">
                {product.title}
              </p>
              <Link
                href={product.url}
                target="_blank"
                className="text-base text-black opacity-50 "
              >
                Visit Product
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="product-hearts">
                <Image
                  src="/assets/icons/red-heart.svg"
                  alt="alt"
                  width={20}
                  height={20}
                />
                <p className="text-base font-semibold text-[#d46f77]">
                  {product.reviewsCount}
                </p>
              </div>
              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src="/assets/icons/bookmark.svg"
                  alt="bookmark"
                  width={20}
                  height={20}
                />
              </div>
              <div className="p-2 bg-white-200 rounded-10">
                <Image
                  src="/assets/icons/share.svg"
                  alt="bookmark"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
          <div className="product-info">
            <div className="flex flex-col gap-2">
              <p className="text-[34px] text-secondary font-bold">
                {product.currency}
                {formatNumber(product.currentPrice)}
              </p>
              <p className="text-[21px] text-black opacity-50 line-through">
                {product.currency}
                {formatNumber(product.originalPrice)}
              </p>
            </div>
            <div>
              <div className="flex flex-col  gap-4">
                <div className="flex gap-3">
                  <div className="product-stars">
                    <Image
                      src="/assets/icons/star.svg"
                      alt="star"
                      width={16}
                      height={16}
                    />
                    <p className="text-sm text-primary text-semibold">
                      {product.stars || "25"}
                    </p>
                  </div>
                  <div className="product-reviews">
                    <Image
                      src="/assets/icons/comment.svg"
                      alt="comment"
                      width={16}
                      height={16}
                    />
                    <p className="text-sm text-secondary font-semibold">
                      {product.reviewsCount || "25"}
                      Reviews
                    </p>
                  </div>
                </div>
                <p className="text-sm text-black opacity-50">
                  <span className="text-primary-green ont-semibold">93% </span>{" "}
                  of buyers have recommended this
                </p>
              </div>
            </div>
            <div className="my-7 flex flex-col gap-5">
              <div className="flex gap-5 flex-wrap">
                <PriceInoCard
                  title="Current Price"
                  iconsSrc="/assets/icons/price-tag.svg"
                  value={`${product.currency}
                ${formatNumber(product.currentPrice)}`}
                  borderColor="#b6dbff"
                />
                <PriceInoCard
                  title="Average Price"
                  iconsSrc="/assets/icons/chart.svg"
                  value={`${product.currency}
                ${formatNumber(product.averagePrice)}`}
                  borderColor="#b6dbff"
                />
                <PriceInoCard
                  title="Current Price"
                  iconsSrc="/assets/icons/arrow-up.svg"
                  value={`${product.currency}
                ${formatNumber(product.highestPrice)}`}
                  borderColor="#b6dbff"
                />
                <PriceInoCard
                  title="Current Price"
                  iconsSrc="/assets/icons/arrow-down.svg"
                  value={`${product.currency}
                ${formatNumber(product.lowestPrice)}`}
                  borderColor="#b2ffc5"
                />
              </div>
            </div>
            <Modal productId={id} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-16 border-2 border-red-500">
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl text-secondary font-semibold">
            Product Description
          </h3>
          <div className="flex flex-col gap-4">
            {product?.description?.split("\n")}
          </div>
        </div>
        <button className="btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]">
          <Image
            src="/assets/icons/bag.svg"
            alt="check"
            width={22}
            height={22}
          />
          <Link href="/" className="text-base text-white">
            Buy Now
          </Link>
        </button>
      </div>
      {simmilarProducts && simmilarProducts?.length > 0 && (
        <div className="py-14 flex flex-col gap-2 w-full">
          <p className="section-text">Similar Products</p>
          <div className="flex flex-wrap gap-10 mt-7 w-full">
            {simmilarProducts?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Productdetail;
