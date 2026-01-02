import Header from "@/components/Header";
import BookClient from "./BookClient";
import { prisma } from "@/lib/prisma";

type PageProps = {
  searchParams: {
    serviceId?: string;
  };
};

export default async function BookPage({ searchParams }: PageProps) {
  const serviceId = searchParams.serviceId;

  let service = null;

  if (serviceId) {
    service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
      },
    });
  }

  return (
    <>
      <Header />
      <BookClient service={service} />
    </>
  );
}
