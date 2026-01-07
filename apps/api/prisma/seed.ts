import { prisma } from '../src/prisma';

async function main() {
    await prisma.recipe.create({
        data: {
            title: 'Test Recipe',
        },
    });

    console.log('Created first recipe! ✨');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
