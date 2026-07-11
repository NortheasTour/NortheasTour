import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(' Iniciando seed...');

  const user = await prisma.user.upsert({
    where: {
      email: 'turista@northeastour.com',
    },
    update: {},
    create: {
      name: 'Turista Demo',
      email: 'turista@northeastour.com',
    },
  });

  const place1 = await prisma.place.upsert({
    where: {
      id: 'place-natal',
    },
    update: {},
    create: {
      id: 'place-natal',
      name: 'Praia de Ponta Negra',
      description:
'Uma das praias mais famosas do Rio Grande do Norte.',
      city: 'Natal',
    },
  });

  const place2 = await prisma.place.upsert({
    where: {
      id: 'place-galinhos',
    },
    update: {},
    create: {
      id: 'place-galinhos',
      name: 'Galinhos',
      description: 
'Destino turístico com praias, dunas e paisagens naturais.',
      city: 'Galinhos',
    },
  });

  const itinerary = await prisma.itinerary.create({
    data: {
      title: 'Conhecendo o litoral potiguar',
      description:
        'Roteiro de demonstração pelo litoral do Rio Grande do Norte.',
      userId: user.id,
      places: {
        create: [
          {
            placeId: place1.id,
          },
          {
            placeId: place2.id,
          },
        ],
      },
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Lugar incrível, recomendo a visita!',
      userId: user.id,
      placeId: place1.id,
    },
  });

  console.log('Seed executado com sucesso!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });