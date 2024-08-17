import { Image } from "primeng/image";

export interface Book{
    id: number;
    title: string;
    author: string;
    pages: number;
    price: number;
    image?: Image;
}