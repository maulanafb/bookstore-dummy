"use client";
import { fetchOrder } from "@/app/order/action";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import BookOrderItem from "./BookOrderItem";

let page = 1;

export type BookItem = JSX.Element;

function LoadMoreOrder({ query }: { query: string }) {
  const { ref, inView } = useInView();
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);

  useEffect(() => {
    // Fungsi untuk memuat data order
    const fetchDataAsync = async () => {
      try {
        // Panggil fetchOrder dengan query pencarian
        const res = await fetchOrder(page, query);
        if (res.length > 0) {
          // Render langsung data yang didapat tanpa menyimpannya di state
          res.forEach((item: any) => {
            renderBookOrderItem(item);
          });
          page += 1; // Tambah 1 ke halaman setelah memuat data
        } else {
          setHasMoreData(false); // Set hasMoreData menjadi false jika tidak ada lagi data
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    // Panggil fetchDataAsync saat komponen masuk ke dalam viewport dan masih ada data yang tersedia
    if (inView && hasMoreData) {
      fetchDataAsync();
    }
  }, [inView, query, hasMoreData]); // Gunakan query sebagai dependensi efek

  // Fungsi untuk merender komponen BookOrderItem
  const renderBookOrderItem = (item: any) => {
    return (
      <BookOrderItem
        book={item.book}
        bookId={item.bookId}
        userId={item.userId}
        id={item.id}
        orderDate={item.orderDate}
        status={item.Status}
        key={item.id}
      />
    );
  };

  return (
    <>
      {/* Tampilkan indikator loading jika masih ada data yang tersedia */}
      {hasMoreData ? (
        <section className="flex justify-center items-center w-full" ref={ref}>
          <div>
            <Image
              src="./spinner.svg"
              alt="spinner"
              width={56}
              height={56}
              className="object-contain"
            />
          </div>
        </section>
      ) : (
        // Tampilkan pesan jika tidak ada lagi data yang tersedia
        <p className="text-center text-gray-500 mt-4 mb-10 block col-span-full">
          No more data
        </p>
      )}
    </>
  );
}

export default LoadMoreOrder;
