import { seedABCHistory } from '../lib/firebase/seed/abcHistory';

async function main() {
  try {
    await seedABCHistory();
    console.log('ABC company history seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

main(); 