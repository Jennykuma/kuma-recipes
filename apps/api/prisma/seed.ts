import { prisma } from '../src/prisma';

async function main() {
    await prisma.recipe.create({
        data: {
            title: 'Test Recipe',
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
