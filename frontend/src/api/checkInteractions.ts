import { drugInteractions } from '../api/drugInteractions';
import type { Medicine } from '../api/mymedicine';

export const checkInteractions = (
  medicines: Medicine[]
) => {
  const results: {
    withDrug: string;
    level: string;
    description: string;
  }[] = [];

  for (let i = 0; i < medicines.length; i++) {
    for (let j = i + 1; j < medicines.length; j++) {
      const m1 = medicines[i];
      const m2 = medicines[j];

      const found = drugInteractions.find(
        d =>
          (d.a === m1.drugCode && d.b === m2.drugCode) ||
          (d.a === m2.drugCode && d.b === m1.drugCode)
      );

      if (found) {
        results.push({
          withDrug: `${m1.name} + ${m2.name}`,
          level: found.level,
          description: found.description,
        });
      }
    }
  }

  return results;
};