import Image from "next/image";
import React from "react";
interface Props {
  title: string;
  iconsSrc: string;
  value: string;
  borderColor: string;
}
const PriceInoCard = ({ title, iconsSrc, value, borderColor }: Props) => {
  return (
    <div className={`price-info_card border-[${borderColor}]`}>
      <p className="class-base text-black-100">{title}</p>
      <div className="flex gap-2">
        <Image src={iconsSrc} width={24} height={24} alt="image" />
        <p className="class-base text-bl ack-100">{value}</p>
      </div>
      <p className="text-2xl font-bold text-secondary">{value}</p>
    </div>
  );
};

export default PriceInoCard;
